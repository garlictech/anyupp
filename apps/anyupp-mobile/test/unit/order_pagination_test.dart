import 'dart:async';

import 'package:equatable/equatable.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rxdart/rxdart.dart';

void main() {
  const String unitId = 'seeded_unit_c1_g1_1_id';
  const String testUserEmail = 'test-monad@anyupp.com';
  const String testUserPassword = 'Hideghegy12_';

  group('Order list pagination test...', () {
    OrderRepository _repository;
    StreamController<List<Order>> _controller;

    setUpAll(() async {
      EquatableConfig.stringify = true;
      await initDependencyInjection();

      ProviderLoginResponse response =
          await getIt<LoginRepository>().loginWithEmailAndPassword(testUserEmail, testUserPassword);
      expect(response, isNotNull);
      expect(response.user, isNotNull);

      _repository = getIt<OrderRepository>();
      expect(_repository, isNotNull);

      _controller = BehaviorSubject();
      expect(_controller, isNotNull);

      await _repository.startOrderListSubscription(unitId, _controller);
      await _repository.startOrderHistoryListSubscription(unitId, _controller);
    });

    test('Test pagination on Order repository', () async {
      // print('endpoint=${AppConfig.AnyuppGraphqlApiUrl}');
      String nextToken;
      List<Order> orders =
          await _repository.loadOrdersNextPage(unitId: unitId, nextToken: nextToken, controller: _controller);
      print('TEST: 1. orders=${orders?.length}');
      nextToken = _repository.orderListNextToken;
      print('TEST: 1. nextToken=$nextToken');

      expect(orders, isNotNull);
      expect(orders.length, 100);
      expect(nextToken, isNotNull);

      // while (_nextToken != null) {
      //   orders = await repository.loadOrdersNextPage(unitId, _nextToken);
      //   _nextToken = repository.orderListNextToken;
      //   await print('TEST: 2. orders=${orders?.length}');
      //   await print('TEST: 2. nextToken=$_nextToken');
      // }

      orders = await _repository.loadOrdersNextPage(unitId: unitId, nextToken: nextToken, controller: _controller);
      print('TEST: 2. orders=${orders?.length}');
      nextToken = _repository.orderListNextToken;
      print('TEST: 2. nextToken=$nextToken');

      expect(orders, []);
      expect(nextToken, isNull);
    });

    test('Test pagination on Order History repository', () async {
      // print('endpoint=${AppConfig.AnyuppGraphqlApiUrl}');
      String nextToken;
      List<Order> orders =
          await _repository.loadOrderHistoryNextPage(unitId: unitId, nextToken: nextToken, controller: _controller);
      print('HISTORY TEST: 1. orders=${orders?.length}');
      nextToken = _repository.orderHistoryListNextToken;
      print('HISTORY TEST: 1. nextToken=$nextToken');

      expect(orders, isNotNull);
      expect(orders.length, greaterThanOrEqualTo(99));
      expect(nextToken, isNotNull);

      orders =
          await _repository.loadOrderHistoryNextPage(unitId: unitId, nextToken: nextToken, controller: _controller);
      print('HISTORY TEST: 2. orders=${orders?.length}');
      nextToken = _repository.orderHistoryListNextToken;
      print('HISTORY TEST: 2. nextToken=$nextToken');

      expect(orders, []);
      expect(nextToken, isNull);
    });

    tearDownAll(() async {
      getIt.unregister<OrderRepository>();
      await _controller?.close();
      await _repository.stopOrderListSubscription();
      await _repository.stopOrderHistoryListSubscription();
      _repository = null;
    });
  });
}
