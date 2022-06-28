import 'dart:async';
import 'dart:math';

import 'package:artemis/artemis.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/rating_tipping/rating_tipping.dart';

// const REPEAT_TIMEOUT_MS = 120000;

class AwsOrderSubscription {
  StreamSubscription<GraphQLResponse<OnOrderChanged$Subscription>>?
      _listSubscription;
  List<Order>? _items;
  String? _nextToken;
  int _totalCount = 0;

  final String userId;

  AwsOrderSubscription({
    required this.userId,
  });

  Future<void> startListSubscription({
    required StreamController<List<Order>?> controller,
  }) async {
    log.d('**** startOrderSubscription.start().controller=$controller');
    if (_listSubscription != null) {
      // log.d('**** startOrderSubscription.stopping');
      await stopListSubscription();
      // log.d('**** startOrderSubscription.stopped');
    }
    // log.d('**** startOrderSubscription.variables=$variables');

    _items = await _getList();
    log.d('**** startOrderSubscription.items=${_items?.length}');
    controller.add(_items);

    if (_items != null) {
      // Schedule notifications if necessary for rating the order
      getIt.get<RatingOrderNotificationBloc>().add(
            CheckAndScheduleOrderRatingNotifications(
              _items!,
            ),
          );
    }

    await _startListSubscription(controller: controller);

    // Start refresh timer.
    await _initSubscriptionRestartTimer();
    // log.d('**** startOrderSubscription.end()');
  }

  Future<void> _startListSubscription(
      {required StreamController<List<Order>?> controller}) async {
    try {
      // ArtemisClient client = await GQL.crud;
      var client = await GQL.amplify.client;
      _listSubscription = GQL.amplify
          .stream(
        OnOrderChangedSubscription(
          variables: OnOrderChangedArguments(
            userId: userId,
          ),
        ),
        client: client,
      )
          .listen((result) async {
        // log.d('**** startListSubscription().onData=${result.data}');
        // log.d('**** startOrderSubscription.onData.hasException=${result.hasException}');
        if (!result.hasErrors) {
          Order item = Order.fromJson(result.data!.onOrderChanged!.toJson());
          getIt<OrderRefreshBloc>().add(RefreshOrder(item));
          // log.d('**** startOrderSubscription.onData.item=$item');

          // Schedule notifications if necessary for rating the order
          getIt<OrderNotificationService>().checkIfShowOrderStatusNotification(
            AppContext.context!,
            [item],
          );

          if (_items == null) {
            _totalCount = 0;
            _nextToken = null;
            _items = [];
          }
          int index = _items!.indexWhere((o) => o.id == item.id);
          // log.d('**** startOrderSubscription.onData.index=$index');
          // Update or Delete
          if (index != -1) {
            // log.d('**** startOrderSubscription.onData.filterModel[$filterModel]=${filterModel(item)}');
            if (!item.archived) {
              _items![index] = item;
              log.d('**** startOrderSubscription.onData.UPDATE');
            } else {
              log.d('**** startOrderSubscription.onData.DELETE');
              _totalCount = max(0, _totalCount - 1);
              _items!.removeAt(index);
            }
            controller.add(_items);
          } else if (!item.archived) {
            // Add
            log.d('**** startOrderSubscription.onData.ADD');
            _totalCount++;
            _items!.add(item);
            _items!.sort((a, b) => b.createdAt.compareTo(a.createdAt));
            controller.add(_items);
          }
        } else {
          log.d('**** startOrderSubscription.exception=${result.errors}');
          // _listController.add(_items);
          await _initSubscriptionRestartTimer();
        }
      }, onDone: () {
        log.d('**** startOrderSubscription.onDone');
      }, onError: (error) {
        log.d('**** startOrderSubscription.onError=$error');
        _initSubscriptionRestartTimer();
      }, cancelOnError: false);
    } on Exception catch (e) {
      log.e('**** startOrderSubscription.Exception: $e');
      rethrow;
    }
    // log.d('**** startOrderSubscription.end()');
    return;
  }

  Future<Null> _initSubscriptionRestartTimer() async {
    // Future.delayed(Duration(milliseconds: REPEAT_TIMEOUT_MS), () async {
    //   await _startListSubscription(variables: variables);
    // });
    return null;
  }

  Future<List<Order>?> _getList() async {
    log.d('_getOrderList().userId=$userId');
    try {
      var result = await GQL.amplify.execute(SearchOrdersQuery(
          variables: SearchOrdersArguments(
        userId: userId,
        limit: getIt<AppConstants>().paginationSize,
        nextToken: _nextToken,
      )));

      log.d('_getOrderList().result.data=${result.data}');
      log.d('_getOrderList().result.errors=${result.errors}');
      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
      }

      if (result.data == null) {
        _nextToken = null;
        _totalCount = 0;
        return [];
      }

      var items = result.data!.searchOrders!.items;
      // log.d('***** _getOrderList().items=$items');
      if (items.isEmpty) {
        _nextToken = null;
        _totalCount = 0;
        return [];
      }

      _totalCount = result.data?.searchOrders?.total ?? 0;
      _nextToken = result.data?.searchOrders?.nextToken;

      log.d('_getOrderList.nextToken=$_nextToken, total=$_totalCount');

      List<Order> results = [];
      for (int i = 0; i < items.length; i++) {
        results.add(Order.fromJson(items[i]!.toJson()));
      }

      log.d('***** _getOrderList().results.length=${results.length}');
      return results;
    } on Exception catch (e) {
      log.e('_getOrderList().Exception: $e');
      rethrow;
    }
  }

  bool get hasMoreItems => _nextToken != null;

  int get itemCount => _totalCount;

  String? get nextToken => _nextToken;

  Future<List<Order>?> loadNextPage({
    String? token,
    required StreamController<List<Order>?> controller,
  }) async {
    log.d('**** loadNextPage().nextToken=$token');
    _nextToken = token;
    List<Order>? items = await _getList();
    // log.d('**** loadNextPage().items=$items');
    if (_items == null) {
      _items = [];
    }
    if (items != null) {
      _items!.addAll(items);
      controller.add(_items);
    }
    log.d('**** loadNextPage().total.count=${_items!.length}');
    return items;
  }

  Future<void> stopListSubscription() async {
    log.d('**** stopListSubscription()');
    try {
      await _listSubscription?.cancel();
      _listSubscription = null;
    } on Error catch (e) {
      log.e('**** stopListSubscription().(ignored).error=$e');
      _listSubscription = null;
    }
    _items = null;
  }
}
