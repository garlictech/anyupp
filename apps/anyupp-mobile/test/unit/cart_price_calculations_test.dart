import 'package:anyupp/graphql/generated/crud-api.dart';
import 'package:anyupp/models.dart';
import 'package:anyupp/modules/cart/utils/cart_to_order_calculations.dart';
import 'package:faker/faker.dart';
import 'package:flutter_test/flutter_test.dart';

import '../mock/mock_data_faker.dart';
import '../utils/debug_utils.dart';

class ConfigSetTestItem {
  final double price;
  final double? netPackagingFee;

  ConfigSetTestItem({
    required this.price,
    this.netPackagingFee,
  });
}

void main() {
  expectDouble(double? value, double expected) {
    expect(value, isNotNull);
    expect((value!.toInt() - expected.toInt()).abs() <= 1, equals(true));
  }

  OrderItem generateItem({
    required String productName,
    required String variantName,
    String? productId,
    String? variantId,
    int quantity = 1,
    double pricePerUnit = 0.0,
    int tax = 0,
    List<ConfigSetTestItem>? modifiers,
    List<ConfigSetTestItem>? extras,
    double? netPackagingFee,
  }) {
    OrderItemConfigSet? modifierSet = modifiers != null
        ? OrderItemConfigSet(
            items: modifiers
                .map((price) => OrderItemConfigComponent(
                      name: MockGenerator.getLocalizedItem('modifierComponent'),
                      price: price.price,
                      netPackagingFee: price.netPackagingFee,
                      productComponentId: faker.guid.guid(),
                    ))
                .toList(),
            name: MockGenerator.getLocalizedItem('modifier_set'),
            type: ProductComponentSetType.modifier,
            productSetId: faker.guid.guid(),
          )
        : null;

    OrderItemConfigSet? extrasSet = extras != null
        ? OrderItemConfigSet(
            items: extras
                .map((price) => OrderItemConfigComponent(
                      name: MockGenerator.getLocalizedItem('extrasComponent'),
                      price: price.price,
                      netPackagingFee: price.netPackagingFee,
                      productComponentId: faker.guid.guid(),
                    ))
                .toList(),
            name: MockGenerator.getLocalizedItem('extras_set'),
            type: ProductComponentSetType.extras,
            productSetId: faker.guid.guid(),
          )
        : null;

    var configSets = [modifierSet, extrasSet];
    configSets.removeWhere((set) => set == null);
    var finalConfigSet = configSets.map((i) => i!).toList();

    return OrderItem(
      productId: productId ?? faker.guid.guid(),
      variantId: variantId ?? faker.guid.guid(),
      productName: MockGenerator.getLocalizedItem(productName),
      priceShown: PriceShown(
        currency: 'huf',
        pricePerUnit: pricePerUnit,
        priceSum: quantity * pricePerUnit,
        tax: tax,
        taxSum: 0,
      ),
      sumPriceShown: PriceShown(
        currency: 'huf',
        pricePerUnit: pricePerUnit,
        priceSum: quantity * pricePerUnit,
        tax: tax,
        taxSum: 0,
      ),
      quantity: quantity,
      statusLog: [
        StatusLog(
          userId: 'userId',
          status: OrderStatus.none,
          ts: DateTime.now().millisecondsSinceEpoch.toDouble(),
        ),
      ],
      variantName: MockGenerator.getLocalizedItem('$variantName'),
      productType: ProductType.food,
      configSets: finalConfigSet,
      netPackagingFee: netPackagingFee,
    );
  }

  Order generateOrder({
    required GeoUnit unit,
    PaymentMethod paymentMethod = PaymentMethod.inapp,
    PaymentType paymentType = PaymentType.stripe,
    required ServingMode servingMode,
    required List<OrderItem> items,
  }) {
    Order order = Order(
      id: faker.guid.guid(),
      unitId: unit.id,
      userId: faker.guid.guid(),
      items: items,
      orderNum: '100',
      sumPriceShown: PriceShown(
        currency: unit.currency,
        pricePerUnit: 0,
        priceSum: 0,
        tax: 0,
        taxSum: 0,
      ),
      orderMode: OrderMode.instant,
      servingMode: servingMode,
      orderPolicy: unit.orderPolicy,
      serviceFeePolicy: unit.serviceFeePolicy,
      ratingPolicies: unit.ratingPolicies,
      soldOutVisibilityPolicy: unit.soldOutVisibilityPolicy,
      tipPolicy: unit.tipPolicy,
      paymentMode: PaymentMode(
        method: paymentMethod,
        type: paymentType,
        caption: paymentMethod.toString(),
      ),
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      archived: false,
    );
    return order;
  }

  group('Testing order list aggregation', () {
    late GeoUnit _unit;

    setUp(() {
      _unit = MockGenerator.generateUnit(name: 'TEST UNIT', currency: 'huf')
          .copyWith(
        orderPaymentPolicy: OrderPaymentPolicy.prepay,
        serviceFeePolicy: ServiceFeePolicy(
          type: ServiceFeeType.applicable,
          percentage: 10.0,
        ),
      );
    });

    test('Testing order calculations #1', () async {
      Order order = generateOrder(
        unit: _unit,
        servingMode: ServingMode.inPlace,
        items: [
          generateItem(
            productName: 'Hamburger',
            variantName: 'Sajtos',
            pricePerUnit: 2000.0,
            tax: 20,
            quantity: 3,
          ),
          generateItem(
            productName: 'Ital',
            variantName: 'Kola',
            pricePerUnit: 250.0,
            tax: 27,
            quantity: 10,
          ),
        ],
      );
      // debugOrder(order);
      order = updateOrderPrices(order);
      debugOrder(order);

      // ServiceFee / Items
      expectDouble(order.items[0].serviceFee?.netPrice, 500);
      expectDouble(order.items[0].serviceFee?.taxPercentage, 20);
      expectDouble(order.items[1].serviceFee?.netPrice, 196.85);
      expectDouble(order.items[1].serviceFee?.taxPercentage, 27);
      // ServiceFee / Order
      expectDouble(order.serviceFee?.grossPrice, 849.9995);
      expectDouble(order.serviceFee?.taxContent, 153.1495);

      // Price / Items
      expectDouble(order.items[0].priceShown.priceSum, 6000);
      expectDouble(order.items[0].priceShown.taxSum, 1000);
      expectDouble(order.items[0].priceShown.pricePerUnit, 2000);
      expectDouble(order.items[1].priceShown.priceSum, 2500);
      expectDouble(order.items[1].priceShown.taxSum, 531.5);
      expectDouble(order.items[1].priceShown.pricePerUnit, 250);

      // SumPrice / Items
      expectDouble(order.items[0].sumPriceShown.priceSum, 6000);
      expectDouble(order.items[0].sumPriceShown.taxSum, 1000);
      expectDouble(order.items[0].sumPriceShown.pricePerUnit, 2000);
      expectDouble(order.items[1].sumPriceShown.priceSum, 2500);
      expectDouble(order.items[1].sumPriceShown.taxSum, 531.5);
      expectDouble(order.items[1].sumPriceShown.pricePerUnit, 250);

      // SumPrice / Order
      expectDouble(order.sumPriceShown.priceSum, 8500);
      expectDouble(order.sumPriceShown.taxSum, 1531.5);
    }, skip: false);
  });
}
