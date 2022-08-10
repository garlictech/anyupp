// formatPackNumber

import 'package:anyupp/graphql/generated/crud-api.dart';
import 'package:anyupp/models.dart';
import 'package:anyupp/modules/menu/menu.dart';
import 'package:flutter_test/flutter_test.dart';

import '../mock/mock_data_faker.dart';

void main() {
  group('Test product price calculation: Test single variant price', () {
    late GeneratedProduct _product;

    setUp(() async {
      _product = MockGenerator.generateProduct(
        name: 'Hamburger',
        configSetCount: 0,
        servingModes: [ServingMode.takeAway],
        variantCount: 1,
      );
      _product = _product.copyWith(variants: [
        MockGenerator.generateProductVariant(
          name: 'Sajtos',
          price: 500.0,
          position: 0,
        )
      ]);
    });

    test('Test single variant price', () async {
      double price = calculateTotalPrice(
          _product, ServingMode.inPlace, _product.variants[0], {}, {});
      expect(price, equals(500.0));
    });
  });

  group('Test product price calculation: Test multiple variant price', () {
    late GeneratedProduct _product;

    setUp(() async {
      _product = MockGenerator.generateProduct(
        name: 'Hamburger',
        configSetCount: 0,
        servingModes: [ServingMode.takeAway],
        variantCount: 1,
      );
      _product = _product.copyWith(variants: [
        MockGenerator.generateProductVariant(
          name: 'Sajtos',
          price: 500.0,
          position: 0,
        ),
        MockGenerator.generateProductVariant(
          name: 'Extra',
          price: 1500.0,
          position: 0,
        )
      ]);
    });

    test('Test price', () async {
      double price = calculateTotalPrice(
          _product, ServingMode.inPlace, _product.variants[1], {}, {});
      expect(price, equals(1500.0));
    });
  });

  group('Test product price calculation: Test extras price', () {
    late GeneratedProduct _product;

    setUp(() async {
      _product = MockGenerator.generateProduct(
        name: 'Hamburger',
        configSetCount: 0,
        servingModes: [ServingMode.takeAway],
        variantCount: 1,
      );

      var configSet = MockGenerator.generateProductConfigSet(
        name: 'Mustárral',
        position: 0,
      );
      configSet = configSet.copyWith(
        type: ProductComponentSetType.extras,
        items: [
          MockGenerator.generateProductConfigComponent(
            name: 'Mustár',
            price: 150.0,
            position: 0,
          ),
        ],
      );

      _product = _product.copyWith(variants: [
        MockGenerator.generateProductVariant(
          name: 'Sajtos',
          price: 500.0,
          position: 0,
        ),
      ], configSets: [
        configSet
      ]);
    });

    test('Test price', () async {
      double price = calculateTotalPrice(
        _product,
        ServingMode.inPlace,
        _product.variants[0],
        {
          _product.configSets![0].productSetId: {
            _product.configSets![0].items[0].productComponentId: true
          }
        },
        {},
      );
      expect(price, equals(500.0 + 150.0));
    });
  });

  group('Test product price calculation: Test modifiers price', () {
    late GeneratedProduct _product;

    setUp(() async {
      _product = MockGenerator.generateProduct(
        name: 'Hamburger',
        configSetCount: 0,
        servingModes: [ServingMode.takeAway],
        variantCount: 1,
      );

      var configSet = MockGenerator.generateProductConfigSet(
        name: 'Mustárral',
        position: 0,
      );
      configSet = configSet.copyWith(
        type: ProductComponentSetType.modifier,
        items: [
          MockGenerator.generateProductConfigComponent(
            name: 'Dupla hús',
            price: 250.0,
            position: 0,
          ),
        ],
      );

      _product = _product.copyWith(variants: [
        MockGenerator.generateProductVariant(
          name: 'Sajtos',
          price: 650.0,
          position: 0,
        ),
      ], configSets: [
        configSet
      ]);
    });

    test('Test single variant price', () async {
      double price = calculateTotalPrice(
        _product,
        ServingMode.inPlace,
        _product.variants[0],
        {},
        {
          _product.configSets![0].productSetId:
              _product.configSets![0].items[0].productComponentId,
        },
      );
      expect(price, equals(650.0 + 250.0));
    });
  });

  group('Test product price calculation: Test with modifiers and extras price',
      () {
    late GeneratedProduct _product;

    setUp(() async {
      _product = MockGenerator.generateProduct(
        name: 'Hamburger',
        configSetCount: 0,
        servingModes: [ServingMode.takeAway],
        variantCount: 1,
      );

      var configModifierSet = MockGenerator.generateProductConfigSet(
        name: 'Plusz adag',
        position: 0,
      );
      configModifierSet = configModifierSet.copyWith(
        type: ProductComponentSetType.modifier,
        items: [
          MockGenerator.generateProductConfigComponent(
            name: 'Dupla hús',
            price: 200.0,
            position: 0,
          ),
        ],
      );
      var configExtrasSet = MockGenerator.generateProductConfigSet(
        name: 'Feltétek',
        position: 0,
      );
      configExtrasSet = configExtrasSet.copyWith(
        type: ProductComponentSetType.extras,
        items: [
          MockGenerator.generateProductConfigComponent(
            name: 'Mustár',
            price: 100.0,
            position: 0,
          ),
        ],
      );

      _product = _product.copyWith(variants: [
        MockGenerator.generateProductVariant(
          name: 'Sajtos',
          price: 500.0,
          position: 0,
        ),
      ], configSets: [
        configModifierSet,
        configExtrasSet,
      ]);
    });

    test('Test single variant price', () async {
      double price = calculateTotalPrice(
        _product,
        ServingMode.inPlace,
        _product.variants[0],
        {
          _product.configSets![1].productSetId: {
            _product.configSets![1].items[0].productComponentId: true
          }
        },
        {
          _product.configSets![0].productSetId:
              _product.configSets![0].items[0].productComponentId,
        },
      );
      expect(price, equals(500.0 + 100.0 + 200.0));
    });
  });

  group(
      'Test product price calculation: Test with takeAway mode with modifiers and extra price',
      () {
    late GeneratedProduct _product;

    setUp(() async {
      _product = MockGenerator.generateProduct(
        name: 'Hamburger',
        configSetCount: 0,
        servingModes: [ServingMode.inPlace, ServingMode.takeAway],
        variantCount: 1,
      );

      var configModifierSet = MockGenerator.generateProductConfigSet(
        name: 'Plusz adag',
        position: 0,
      );
      configModifierSet = configModifierSet.copyWith(
        type: ProductComponentSetType.modifier,
        supportedServingModes: [ServingMode.inPlace, ServingMode.takeAway],
        items: [
          MockGenerator.generateProductConfigComponent(
            name: 'Dupla hús',
            price: 200.0,
            position: 0,
          ),
        ],
      );
      var configExtrasSet = MockGenerator.generateProductConfigSet(
        name: 'Feltétek',
        position: 0,
      );
      configExtrasSet = configExtrasSet.copyWith(
        type: ProductComponentSetType.extras,
        supportedServingModes: [ServingMode.takeAway],
        items: [
          MockGenerator.generateProductConfigComponent(
            name: 'Mustár',
            price: 100.0,
            position: 0,
          ),
        ],
      );

      _product = _product.copyWith(variants: [
        MockGenerator.generateProductVariant(
          name: 'Sajtos',
          price: 500.0,
          position: 0,
        ),
      ], configSets: [
        configModifierSet,
        configExtrasSet,
      ], supportedServingModes: [
        ServingMode.inPlace,
        ServingMode.takeAway
      ]);
    });

    test('Test single variant price', () async {
      double price = calculateTotalPrice(
        _product,
        ServingMode.inPlace,
        _product.variants[0],
        {
          _product.configSets![1].productSetId: {
            _product.configSets![1].items[0].productComponentId: true
          }
        },
        {
          _product.configSets![0].productSetId:
              _product.configSets![0].items[0].productComponentId,
        },
      );
      expect(price, equals(500.0 + 200.0));

      price = calculateTotalPrice(
        _product,
        ServingMode.takeAway,
        _product.variants[0],
        {
          _product.configSets![1].productSetId: {
            _product.configSets![1].items[0].productComponentId: true
          }
        },
        {
          _product.configSets![0].productSetId:
              _product.configSets![0].items[0].productComponentId,
        },
      );
      expect(price, equals(500.0 + 100.0 + 200.0));
    });
  });
}
