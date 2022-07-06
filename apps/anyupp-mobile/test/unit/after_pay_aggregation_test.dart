import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/utils/order_afterpay_utils.dart';
import 'package:flutter_test/flutter_test.dart';

import '../mock/mock_data_faker.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

void main() {
  Order generateOrder(
      double totalPrice, double? serviceFee, double? packagingFee,
      [String? transactionId]) {
    Order order = MockGenerator.generateOrder(
      name: 'name',
      method: PaymentMethod.inapp,
      paymentType: PaymentType.stripe,
      status: OrderStatus.served,
      price: totalPrice,
    );
    return order.copyWith(
      transactionId: transactionId,
      serviceFee: serviceFee != null
          ? CumulatedPrice(
              currency: 'huf',
              grossPrice: serviceFee,
              taxContent: 0,
            )
          : null,
      packagingSum: packagingFee != null
          ? Price(
              currency: 'huf',
              netPrice: packagingFee,
              taxPercentage: 0,
            )
          : null,
    );
  }

  group('Testing order list aggregation', () {
    test(
        'Testing order list aggregation int single order - 2 orders, no servicefee, no packagingfee',
        () async {
      Order o1 = generateOrder(1000, 0, 0);
      Order o2 = generateOrder(2000, 0, 0);
      Order? aggregated = aggregateOrders([o1, o2]);

      expect(aggregated, isNotNull);
      expect(aggregated?.sumPriceShown.priceSum, 3000);
    });

    test(
        'Testing order list aggregation int single order - 2 orders, +servicefee, no packagingfee',
        () async {
      Order o1 = generateOrder(1000, 100, 0);
      Order o2 = generateOrder(2000, 100, 0);
      Order? aggregated = aggregateOrders([o1, o2]);

      expect(aggregated, isNotNull);
      expect(aggregated?.sumPriceShown.priceSum, 3000);
      expect(aggregated?.serviceFee?.grossPrice, 200);
      expect(aggregated?.packagingSum?.netPrice, 0);
    });

    test(
        'Testing order list aggregation int single order - 2 orders, no servicefee, +packagingfee',
        () async {
      Order o1 = generateOrder(1000, 0, 50);
      Order o2 = generateOrder(2000, 0, 50);
      Order? aggregated = aggregateOrders([o1, o2]);

      expect(aggregated, isNotNull);
      expect(aggregated?.sumPriceShown.priceSum, 3000);
      expect(aggregated?.serviceFee?.grossPrice, 0);
      expect(aggregated?.packagingSum?.netPrice, 100);
    });
  });

  group('Testing order list grouping', () {
    test('Testing order list grouping map by they transaction ID', () async {
      Order o1 = generateOrder(1000, 0, 0, 'transaction1');
      Order o2 = generateOrder(2000, 0, 0, 'transaction1');

      var orderMap = groupOrdersByTransactionId(orders: [o1, o2]);
      expect(orderMap.keys.first, equals('transaction1'));
    });

    test('Testing order list grouping list by they transaction ID - 1',
        () async {
      Order o1 = generateOrder(1000, 0, 0, 'transaction1');
      Order o2 = generateOrder(2000, 0, 0, 'transaction1');
      Order o3 = generateOrder(2000, 0, 0, null);
      Order o4 = generateOrder(2000, 0, 0, null);

      var orderList = groupOrdersListByTransactionId(orders: [o1, o2, o3, o4]);
      expect(orderList.length, equals(3));
      expect(orderList[0].length, equals(2));
    });

    test('Testing order list grouping list by they transaction ID - 2',
        () async {
      Order o1 = generateOrder(1000, 0, 0, 'transaction1');
      Order o2 = generateOrder(2000, 0, 0, 'transaction1');
      Order o3 = generateOrder(2000, 0, 0, 'transaction2');
      Order o4 = generateOrder(2000, 0, 0, 'transaction2');

      var orderList = groupOrdersListByTransactionId(orders: [o1, o2, o3, o4]);
      expect(orderList.length, equals(2));
      expect(orderList[0].length, equals(2));
      expect(orderList[1].length, equals(2));
    });

    test('Testing order list grouping list by they transaction ID - 3',
        () async {
      Order o1 = generateOrder(1000, 0, 0, null);
      Order o2 = generateOrder(2000, 0, 0, null);
      Order o3 = generateOrder(2000, 0, 0, null);
      Order o4 = generateOrder(2000, 0, 0, null);

      var orderList = groupOrdersListByTransactionId(orders: [o1, o2, o3, o4]);
      expect(orderList.length, equals(4));
      expect(orderList[0].length, equals(1));
      expect(orderList[1].length, equals(1));
      expect(orderList[2].length, equals(1));
      expect(orderList[3].length, equals(1));
    });

    test('Testing order list grouping list by they transaction ID - 4',
        () async {
      var orderList = groupOrdersListByTransactionId(orders: []);
      expect(orderList.length, equals(0));
      orderList = groupOrdersListByTransactionId();
      expect(orderList.length, equals(0));
    });
  });
}
