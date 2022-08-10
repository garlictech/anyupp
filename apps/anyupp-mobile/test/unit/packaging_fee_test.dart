import 'package:anyupp/core/core.dart';
import 'package:anyupp/graphql/generated/crud-api.dart';
import 'package:anyupp/models.dart';
import 'package:anyupp/modules/cart/cart.dart';
import 'package:flutter_test/flutter_test.dart';

import '../mock/mock_data_faker.dart';
import '../widget/mock/mocks.dart';

void main() {
  setUpAll(() {
    // Setup
    Unit mockUnit = MockGenerator.generateUnit(
      name: 'Test Unit',
      currency: 'huf',
    ).copyWith(
      packagingTax: 10,
    );
    getIt.registerSingleton<UnitSelectBloc>(MockUnitSelectBloc(mockUnit));
  });

  group('Packaging fee calculation tests', () {
    test('Calculate simple packaging fee: product with only one variant',
        () async {
      Cart cart = MockGenerator.generateBasicCart(
        servingMode: ServingMode.inPlace,
      );
      // Check empty cart
      expect(cart.totalPrice, equals(0));
      expect(cart.packaginFee, equals(0));

      cart = cart.copyWith(items: [
        MockGenerator.generateOrderItem(
          name: 'Hamburger',
          variantName: 'Sima',
          price: 500.0,
          status: OrderStatus.placed,
          packagingFee: 100.0,
          quantity: 1,
        ),
      ]);
      // In Place mode the price not contains packaging fee
      expect(cart.totalPrice, equals(500.0));
      expect(cart.packaginFee, equals(0));

      // Increase quantity of the order
      cart = cart.copyWith(items: [
        cart.items[0].copyWith(
          quantity: 3,
        )
      ]);
      // In Place mode the price not contains packaging fee
      expect(cart.totalPrice, equals(3 * 500.0));
      expect(cart.packaginFee, equals(0));

      // Reset quantity of the order to 1
      cart = cart.copyWith(items: [
        cart.items[0].copyWith(
          quantity: 1,
        )
      ]);

      // Switch to takeaway mode
      cart = cart.copyWith(servingMode: ServingMode.takeAway);

      // Takeaway mode the price includes the packagingFee
      expect(cart.totalPrice, equals(610.0)); // 10% tax
      expect(cart.packaginFee, equals(110.0)); // 100 + 10 = 10% tax

      // Increase quantity of the order
      cart = cart.copyWith(items: [
        cart.items[0].copyWith(
          quantity: 3,
        )
      ]);

      // Takeaway mode the price includes the packagingFee and quantity
      expect(cart.totalPrice, equals(3 * 610.0));
      expect(cart.packaginFee, equals(3 * 110.0));
    });

    test('Calculate packaging fee: multiple products', () async {
      Cart cart = MockGenerator.generateBasicCart(
        servingMode: ServingMode.inPlace,
      );
      // Check empty cart
      expect(cart.totalPrice, equals(0));
      expect(cart.packaginFee, equals(0));

      cart = cart.copyWith(items: [
        MockGenerator.generateOrderItem(
          name: 'Hamburger',
          variantName: 'Sima',
          price: 500.0,
          status: OrderStatus.placed,
          packagingFee: 100.0,
          quantity: 1,
        ),
        MockGenerator.generateOrderItem(
          name: 'Hamburger',
          variantName: 'Extra',
          price: 750.0,
          status: OrderStatus.placed,
          packagingFee: 150.0,
          quantity: 1,
        ),
      ]);
      // In Place mode the price not contains packaging fee
      expect(cart.totalPrice, equals(750.0 + 500.0));
      expect(cart.packaginFee, equals(0));

      // Switch to takeaway mode
      cart = cart.copyWith(servingMode: ServingMode.takeAway);

      // Takeaway mode the price includes the packagingFee
      expect(cart.totalPrice,
          equals(750.0 + 500.0 + 100.0 + 150.0 + 25.0)); // 25.0 = 10% tax
      expect(cart.packaginFee, equals(100.0 + 150.0 + 10.0 + 15.0));
    });

    test('Calculate packaging fee with modifiers: product with modifiers',
        () async {
      Cart cart = MockGenerator.generateBasicCart(
        servingMode: ServingMode.inPlace,
      );
      // Check empty cart
      expect(cart.totalPrice, equals(0));
      expect(cart.packaginFee, equals(0));

      ProductConfigSet configSet =
          MockGenerator.generateEmptyProductConfigSet(
        name: 'Test Modifier Set',
        type: ProductComponentSetType.modifier,
      );

      cart = cart.copyWith(items: [
        MockGenerator.generateOrderItem(
          name: 'Hamburger',
          variantName: 'Sima',
          price: 500.0,
          status: OrderStatus.placed,
          packagingFee: 100.0,
        ).copyWith(selectedConfigMap: {
          configSet: [
            MockGenerator.generateProductConfigComponent(
              name: 'Modifier#1',
              price: 100.0,
              packagingFee: 50.0,
            ),
          ]
        }),
      ]);
      // In Place mode the price not contains packaging fee
      expect(cart.totalPrice, equals(500.0 + 100.0));
      expect(cart.packaginFee, equals(0));

      // Switch to takeaway mode
      cart = cart.copyWith(servingMode: ServingMode.takeAway);

      // Takeaway mode the price includes the packagingFee
      expect(
          cart.totalPrice, equals(100.0 + 50.0 + 500.0 + 100.0 + 10.0 + 5.0));
      expect(cart.packaginFee, equals(100.0 + 50.0 + 10.0 + 5.0));

      // Add more modifiers
      cart = cart.copyWith(items: [
        MockGenerator.generateOrderItem(
          name: 'Hamburger',
          variantName: 'Sima',
          price: 500.0,
          status: OrderStatus.placed,
          packagingFee: 100.0,
        ).copyWith(selectedConfigMap: {
          configSet: [
            MockGenerator.generateProductConfigComponent(
              name: 'Modifier#1',
              price: 100.0,
              packagingFee: 50.0,
            ),
            MockGenerator.generateProductConfigComponent(
              name: 'Modifier#1',
              price: 100.0,
              packagingFee: 50.0,
            ),
          ]
        }),
      ]);

      // Takeaway mode the price includes the packagingFee
      expect(cart.totalPrice, equals(900.0 + 20.0));
      expect(cart.packaginFee, equals(100.0 + 50.0 + 50.0 + 20.0));

      // Multiply items
      cart = cart.copyWith(items: [
        cart.items[0].copyWith(quantity: 2),
      ]);

      // Takeaway mode the price includes the packagingFee
      expect(cart.totalPrice, equals(920.0 * 2));
      expect(cart.packaginFee, equals(220.0 * 2));
    });
  });
}
