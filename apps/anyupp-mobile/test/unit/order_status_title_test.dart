// formatPackNumber

import '/graphql/generated/crud-api.dart';
import '/modules/orders/orders.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  void testWithExpectedValue(
      OrderPolicy? policy, OrderStatus status, String expectedKey) {
    String key = getOrderStatusTitleKeyByPolicy(policy, status);
    expect(key, equals(expectedKey));
  }

  group('Test order status title key creation by order policy and statrus', () {
    test('Test without simplified flow #1', () async {
      testWithExpectedValue(
        OrderPolicy.full,
        OrderStatus.none,
        'orders.infos.status.none.title',
      );
      testWithExpectedValue(
        OrderPolicy.full,
        OrderStatus.placed,
        'orders.infos.status.placed.title',
      );
      testWithExpectedValue(
        OrderPolicy.full,
        OrderStatus.processing,
        'orders.infos.status.processing.title',
      );
      testWithExpectedValue(
        OrderPolicy.full,
        OrderStatus.ready,
        'orders.infos.status.ready.title',
      );
    });

    test('Test without simplified flow #2', () async {
      testWithExpectedValue(
        null,
        OrderStatus.none,
        'orders.infos.status.none.title',
      );
      testWithExpectedValue(
        null,
        OrderStatus.placed,
        'orders.infos.status.placed.title',
      );
      testWithExpectedValue(
        null,
        OrderStatus.processing,
        'orders.infos.status.processing.title',
      );
      testWithExpectedValue(
        null,
        OrderStatus.ready,
        'orders.infos.status.ready.title',
      );
    });

    test('Test simplified flow #1', () async {
      testWithExpectedValue(
        OrderPolicy.placeOnly,
        OrderStatus.none,
        'orders.infos.status.none.title',
      );
      testWithExpectedValue(
        OrderPolicy.placeOnly,
        OrderStatus.placed,
        'orders.infos.status.simplified.title',
      );
      testWithExpectedValue(
        OrderPolicy.placeOnly,
        OrderStatus.processing,
        'orders.infos.status.simplified.title',
      );
      testWithExpectedValue(
        OrderPolicy.placeOnly,
        OrderStatus.ready,
        'orders.infos.status.simplified.title',
      );
    });

    test('Test simplified flow #2', () async {
      testWithExpectedValue(
        OrderPolicy.placeWithPaymentType,
        OrderStatus.none,
        'orders.infos.status.none.title',
      );
      testWithExpectedValue(
        OrderPolicy.placeWithPaymentType,
        OrderStatus.placed,
        'orders.infos.status.simplified.title',
      );
      testWithExpectedValue(
        OrderPolicy.placeWithPaymentType,
        OrderStatus.processing,
        'orders.infos.status.simplified.title',
      );
      testWithExpectedValue(
        OrderPolicy.placeWithPaymentType,
        OrderStatus.ready,
        'orders.infos.status.simplified.title',
      );
    });
  });
}
