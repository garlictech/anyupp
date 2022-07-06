import 'dart:async';
import 'dart:math';
import 'package:artemis/artemis.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';

const REPEAT_TIMEOUT_MS = 120000;

class AwsOrderHistorySubscription {
  StreamSubscription<GraphQLResponse<OnOrderHistoryChanged$Subscription>>?
      _listSubscription;
  List<Order>? _items;
  String? _nextToken;
  int _totalCount = 0;

  final String userId;

  AwsOrderHistorySubscription({
    required this.userId,
  });

  Future<void> startListSubscription({
    required StreamController<List<Order>?> controller,
  }) async {
    log.d('**** startOrderHistorySubscription.start().controller=$controller');
    if (_listSubscription != null) {
      // log.d('**** startOrderHistorySubscription.stopping');
      await stopListSubscription();
      // log.d('**** startOrderHistorySubscription.stopped');
    }
    // log.d('**** startOrderHistorySubscription.variables=$variables');

    _items = await _getList();
    log.d('**** startOrderHistorySubscription.items=${_items?.length}');
    controller.add(_items);

    await _startListSubscription(controller: controller);

    // Start refresh timer.
    await _initSubscriptionRestartTimer();
    // log.d('**** startOrderHistorySubscription.end()');
  }

  Future<void> _startListSubscription({
    required StreamController<List<Order>?> controller,
  }) async {
    try {
      var client = await GQL.amplify.client;
      _listSubscription = GQL.amplify
          .stream(
        OnOrderHistoryChangedSubscription(
          variables: OnOrderHistoryChangedArguments(
            userId: userId,
          ),
        ),
        client: client,
      )
          .listen((result) async {
        // log.d('**** startOrderHistorySubscription().onData=${result.data}');
        // log.d('**** startOrderSubscription.onData.hasException=${result.hasException}');
        if (!result.hasErrors) {
          if (result.data?.onOrderChanged == null) {
            return;
          }

          Order item = Order.fromJson(result.data!.onOrderChanged!.toJson());
          // log.d('**** startOrderSubscription.onData.item=$item');
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
            if (item.archived) {
              _items![index] = item;
              log.d('**** startOrderHistorySubscription.onData.UPDATE');
            } else {
              log.d('**** startOrderHistorySubscription.onData.DELETE');
              _totalCount = max(0, _totalCount - 1);
              _items!.removeAt(index);
            }
            controller.add(_items);
          } else if (item.archived) {
            // Add
            log.d('**** startOrderHistorySubscription.onData.ADD');
            _totalCount++;
            _items!.add(item);
            _items!.sort((a, b) => b.createdAt.compareTo(a.createdAt));
            controller.add(_items);
          }
        } else {
          log.d(
              '**** startOrderHistorySubscription.exception=${result.errors}');
          // _listController.add(_items);
          await _initSubscriptionRestartTimer();
        }
      }, onDone: () {
        log.d('**** startOrderHistorySubscription.onDone');
      }, onError: (error) {
        log.d('**** startOrderHistorySubscription.onError=$error');
        _initSubscriptionRestartTimer();
      }, cancelOnError: false);
    } on Exception catch (e) {
      log.e('**** startOrderHistorySubscription.Exception: $e');
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
    log.d('_getOrderHistoryList().userId=$userId');
    try {
      var result = await GQL.amplify.execute(SearchOrderHistoryQuery(
          variables: SearchOrderHistoryArguments(
        userId: userId,
        limit: getIt<AppConstants>().paginationSize,
        nextToken: _nextToken,
      )));

      log.d('_getOrderHistoryList().result.data=${result.data}');
      // log.d('_getOrderHistoryList().result.exception=${result.exception}');
      if (result.data?.searchOrders == null) {
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

      // log.d('_getOrderList.nextToken=$_nextToken, total=$_totalCount');

      List<Order> results = [];
      for (int i = 0; i < items.length; i++) {
        // log.d(
        //     '**** _getOrderHistoryList._getList.order[${items[i]!.id}].hasRated=${items[i]!.hasRated}');

        results.add(Order.fromJson(items[i]!.toJson()));
      }

      log.d('***** _getOrderHistoryList().results.length=${results.length}');
      return results;
    } on Exception catch (e) {
      log.e('_getOrderHistoryList().Exception: $e');
      rethrow;
    }
  }

  bool get hasMoreItems =>
      _nextToken != null && _totalCount >= getIt<AppConstants>().paginationSize;

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
    // _listController.add(_items);
  }
}
