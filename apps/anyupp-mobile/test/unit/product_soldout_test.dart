import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter_test/flutter_test.dart';

import '../mock/mock_data_faker.dart';

void main() {
  group('Test product soldOut visibility calculation', () {
    List<ProductVariant> _genVariants(List<bool> soldOutVariants) {
      List<ProductVariant> variants = [];
      soldOutVariants.forEach((soldOut) {
        variants.add(MockGenerator.generateProductVariant(
                name: 'DUMMY', price: 0, position: 0)
            .copyWith(soldOut: soldOut));
      });
      return variants;
    }

    GeneratedProductConfigSet _genConfigSet(List<bool> soldOutComponents) {
      var set = MockGenerator.generateEmptyProductConfigSet(
          name: 'TEST COMPONENT SET');
      List<GeneratedProductConfigComponent> components = [];
      soldOutComponents.forEach((soldOut) {
        components.add(MockGenerator.generateProductConfigComponent(
          name: 'TEST COMPONENT',
          price: 0,
        ).copyWith(
          soldOut: soldOut,
        ));
      });
      set = set.copyWith(
        items: components,
      );
      return set;
    }

    GeneratedProduct _genProduct(
        {bool productSoldOut = false,
        List<bool> variantsSoldOut = const [false],
        List<bool>? configsSoldOut}) {
      var product = MockGenerator.generateProduct(
        name: 'Hamburger',
        configSetCount: 0,
        servingModes: [ServingMode.takeAway],
        variantCount: 1,
      );
      return product.copyWith(
        soldOut: productSoldOut,
        variants: _genVariants(variantsSoldOut),
        configSets:
            configsSoldOut != null ? [_genConfigSet(configsSoldOut)] : null,
      );
    }

    test('Product not sold out', () async {
      var product = _genProduct(
        productSoldOut: false,
        variantsSoldOut: [false],
      );
      expect(product.isSoldOut, equals(false));
    });

    test('Test Product soldOut', () async {
      var product = _genProduct(
        productSoldOut: true,
        variantsSoldOut: [false],
      );
      expect(product.isSoldOut, equals(true));
    });

    test('Test Product soldOut + All variants soldOut', () async {
      var product = _genProduct(
        productSoldOut: false,
        variantsSoldOut: [true],
      );
      expect(product.isSoldOut, equals(true));
    });
  });
}
