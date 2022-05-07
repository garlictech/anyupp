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

  final String unitId;
  final String userId;

  AwsOrderHistorySubscription({
    required this.userId,
    required this.unitId,
  });

  Future<void> startListSubscription({
    required StreamController<List<Order>?> controller,
  }) async {
    print('**** startOrderHistorySubscription.start().controller=$controller');
    if (_listSubscription != null) {
      // print('**** startOrderHistorySubscription.stopping');
      await stopListSubscription();
      // print('**** startOrderHistorySubscription.stopped');
    }
    // print('**** startOrderHistorySubscription.variables=$variables');

    _items = await _getList();
    print('**** startOrderHistorySubscription.items=${_items?.length}');
    controller.add(_items);

    await _startListSubscription(controller: controller);

    // Start refresh timer.
    await _initSubscriptionRestartTimer();
    // print('**** startOrderHistorySubscription.end()');
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
            unitId: unitId,
            userId: userId,
          ),
        ),
        client: client,
      )
          .listen((result) async {
        // print('**** startOrderHistorySubscription().onData=${result.data}');
        // print('**** startOrderSubscription.onData.hasException=${result.hasException}');
        if (!result.hasErrors) {
          if (result.data?.onOrderChanged == null) {
            return;
          }

          Order item = Order.fromJson(result.data!.onOrderChanged!.toJson());
          // print('**** startOrderSubscription.onData.item=$item');
          if (_items == null) {
            _totalCount = 0;
            _nextToken = null;
            _items = [];
          }
          int index = _items!.indexWhere((o) => o.id == item.id);
          // print('**** startOrderSubscription.onData.index=$index');
          // Update or Delete
          if (index != -1) {
            // print('**** startOrderSubscription.onData.filterModel[$filterModel]=${filterModel(item)}');
            if (item.archived) {
              _items![index] = item;
              print('**** startOrderHistorySubscription.onData.UPDATE');
            } else {
              print('**** startOrderHistorySubscription.onData.DELETE');
              _totalCount = max(0, _totalCount - 1);
              _items!.removeAt(index);
            }
            controller.add(_items);
          } else if (item.archived) {
            // Add
            print('**** startOrderHistorySubscription.onData.ADD');
            _totalCount++;
            _items!.add(item);
            _items!.sort((a, b) => b.createdAt.compareTo(a.createdAt));
            controller.add(_items);
          }
        } else {
          print(
              '**** startOrderHistorySubscription.exception=${result.errors}');
          // _listController.add(_items);
          await _initSubscriptionRestartTimer();
        }
      }, onDone: () {
        print('**** startOrderHistorySubscription.onDone');
      }, onError: (error) {
        print('**** startOrderHistorySubscription.onError=$error');
        _initSubscriptionRestartTimer();
      }, cancelOnError: false);
    } on Exception catch (e) {
      print('**** startOrderHistorySubscription.Exception: $e');
      rethrow;
    }
    // print('**** startOrderSubscription.end()');
    return;
  }

  Future<Null> _initSubscriptionRestartTimer() async {
    // Future.delayed(Duration(milliseconds: REPEAT_TIMEOUT_MS), () async {
    //   await _startListSubscription(variables: variables);
    // });
    return null;
  }

  Future<List<Order>?> _getList() async {
    print('_getOrderHistoryList().userId=$userId, unitId=$unitId');
    try {
      var result = await GQL.amplify.execute(SearchOrderHistoryQuery(
          variables: SearchOrderHistoryArguments(
        userId: userId,
        unitId: unitId,
        limit: getIt<AppConstants>().paginationSize,
        nextToken: _nextToken,
      )));

      print('_getOrderHistoryList().result.data=${result.data}');
      // print('_getOrderHistoryList().result.exception=${result.exception}');
      if (result.data?.searchOrders == null) {
        _nextToken = null;
        _totalCount = 0;
        return [];
      }

      var items = result.data!.searchOrders!.items;
      // print('***** _getOrderList().items=$items');
      if (items.isEmpty) {
        _nextToken = null;
        _totalCount = 0;
        return [];
      }

      _totalCount = result.data?.searchOrders?.total ?? 0;
      _nextToken = result.data?.searchOrders?.nextToken;

      // print('_getOrderList.nextToken=$_nextToken, total=$_totalCount');

      List<Order> results = [];
      for (int i = 0; i < items.length; i++) {
        print(
            '**** _getOrderHistoryList._getList.order[${items[i]!.id}].hasRated=${items[i]!.hasRated}');

        results.add(Order.fromJson(items[i]!.toJson()));
      }

      print('***** _getOrderHistoryList().results.length=${results.length}');
      return results;
    } on Exception catch (e) {
      print('_getOrderHistoryList().Exception: $e');
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
    print('**** loadNextPage().nextToken=$token');
    _nextToken = token;
    List<Order>? items = await _getList();
    // print('**** loadNextPage().items=$items');
    if (_items == null) {
      _items = [];
    }
    if (items != null) {
      _items!.addAll(items);
      controller.add(_items);
    }
    print('**** loadNextPage().total.count=${_items!.length}');
    return items;
  }

  Future<void> stopListSubscription() async {
    print('**** stopListSubscription()');
    try {
      await _listSubscription?.cancel();
      _listSubscription = null;
    } on Error catch (e) {
      print('**** stopListSubscription().(ignored).error=$e');
      _listSubscription = null;
    }
    _items = null;
    // _listController.add(_items);
  }
}
