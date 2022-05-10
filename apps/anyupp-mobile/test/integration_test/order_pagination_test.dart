import 'dart:async';

import 'package:equatable/equatable.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rxdart/rxdart.dart';

import '../fixtures.dart';
import '../graphql/graphql_dummy.dart';

void main() {
  const int dummy_order_count = 13;
  const int dummy_order_history_count = 12;
  const int dummy_page_size = 3;
  late OrderRepository _repository;
  late StreamController<List<Order>> _controller;

  cleanUpOrders() async {
    List<bool> deleteResults = await deleteAllOrders(testUsername, unitId);
    print('***** Deleting all orders results=${deleteResults}');
  }

  setUpAll(() async {
    EquatableConfig.stringify = true;
    await initDependencyInjection();

    _controller = BehaviorSubject();
    expect(_controller, isNotNull);

    _repository = getIt<OrderRepository>();
    expect(_repository, isNotNull);

    AppConstants constants = getIt<AppConstants>();
    await getIt.unregister<AppConstants>(instance: constants);
    getIt.registerLazySingleton<AppConstants>(() => AppConstants(
          paginationSize: dummy_page_size,
        ));

    constants = getIt<AppConstants>();
    print('Pagination size=' + constants.paginationSize.toString());

    ProviderLoginResponse response =
        await getIt<LoginRepository>().loginWithEmailAndPassword(
      testUserEmail,
      testUserPassword,
    );
    expect(response, isNotNull);
    expect(response.user, isNotNull);

    await cleanUpOrders();

    print('Creating orders');
    await createDummyOrders(
      userId: testUsername,
      unitId: unitId,
      count: dummy_order_count,
      archived: false,
    );

    print('Creating order histories');
    await createDummyOrders(
      userId: testUsername,
      unitId: unitId,
      count: dummy_order_history_count,
      archived: true,
    );

    print('Waiting to backend to finish order creation');
    await Future.delayed(Duration(seconds: 5));

    await _repository.startOrderListSubscription(unitId, _controller);
    await _repository.startOrderHistoryListSubscription(unitId, _controller);
  });
  group('Order list pagination test...', () {
    void _checkOrdersSortOrder(List<Order> orders) {
      expect(orders, isNotNull);
      for (int i = 0; i < orders.length - 1; i++) {
        DateTime date1 = orders[i].createdAt;
        DateTime date2 = orders[i + 1].createdAt;
        expect(date1.millisecondsSinceEpoch,
            greaterThanOrEqualTo(date2.millisecondsSinceEpoch));
      }
    }

    test('Test pagination on Order repository', () async {
      String? nextToken;
      int remainingCount = dummy_order_count % dummy_page_size;
      print('TEST.remainingCount=$remainingCount');
      int i = 0;
      do {
        List<Order>? orders = await _repository.loadOrdersNextPage(
          nextToken: nextToken,
          controller: _controller,
        );
        expect(orders, isNotNull);
        print('TEST[$i].orders.length=${orders?.length}');
        nextToken = _repository.orderListNextToken;
        print('TEST[$i].nextToken=$nextToken');
        if (orders!.length == dummy_page_size) {
          _checkOrdersSortOrder(orders);
          expect(orders.length, dummy_page_size);
        } else if (orders.isNotEmpty) {
          _checkOrdersSortOrder(orders);
          expect(orders, isNotNull);
          expect(orders.length, remainingCount);
          expect(nextToken, isNotNull);
        } else if (orders.isEmpty) {
          expect(orders, []);
          expect(nextToken, isNull);
        }
        i++;
      } while (nextToken != null);
    }, skip: false);

    test('dummy', () async {
      print('DUMMY.START 5 SEC');
      await Future.delayed(Duration(seconds: 2));
    }, skip: true);

    test('Test pagination on Order History repository', () async {
      String? nextToken;
      int remainingCount = dummy_order_history_count % dummy_page_size;
      print('HISTORY TEST.remainingCount=$remainingCount');
      int i = 0;
      do {
        List<Order>? histories = await _repository.loadOrderHistoryNextPage(
          nextToken: nextToken,
          controller: _controller,
        );
        expect(histories, isNotNull);
        print('HISTORY TEST[$i].orders.length=${histories?.length}');
        nextToken = _repository.orderHistoryListNextToken;
        print('HISTORY TEST[$i].nextToken=$nextToken');
        if (histories!.length == dummy_page_size) {
          _checkOrdersSortOrder(histories);
          expect(histories.length, dummy_page_size);
        } else if (histories.isNotEmpty) {
          _checkOrdersSortOrder(histories);
          expect(histories, isNotNull);
          expect(histories.length, remainingCount);
          expect(nextToken, isNotNull);
        } else if (histories.isEmpty) {
          expect(histories, []);
          expect(nextToken, isNull);
        }
        i++;
      } while (nextToken != null);
    }, skip: false);

    tearDownAll(() async {
      await cleanUpOrders();
      await _controller.close();
      await _repository.stopOrderListSubscription();
      await _repository.stopOrderHistoryListSubscription();
      getIt.unregister<OrderRepository>();
    });
  }, skip: true);
}
