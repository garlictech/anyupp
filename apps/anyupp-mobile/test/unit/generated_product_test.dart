import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:fa_prev/core/logger.dart';

import 'utils/json_loader.dart';

void main() {
  late List<GeneratedProduct> _generatedProducts;
  late List<UnitProduct> _unitProducts;
  late Map<String, ProductComponentSet> _productComponentSets;
  late Map<String, ProductComponent> _productComponents;

  Future<List<GeneratedProduct>> _loadAndParseGeneratedProducts() async {
    var jsonProduct = await loadJson(
      'test/unit/data/list_generated_product_response.json',
    );
    List data = jsonProduct['data']['listGeneratedProducts']['items'];
    return data.map((json) => GeneratedProduct.fromJson(json)).toList();
  }

  Future<List<UnitProduct>> _loadAndParseUnitProducts() async {
    var jsonProduct = await loadJson(
      'test/unit/data/list_unit_products_response.json',
    );
    List unitProducts =
        List.from(jsonProduct['data']['searchUnitProducts']['items']);
    return unitProducts.map((e) => UnitProduct.fromJson(e)).toList();
  }

  Future<Map<String, ProductComponentSet>>
      _loadAndParseProductComponentSets() async {
    var jsonProductSets = await loadJson(
      'test/unit/data/list_product_component_sets_response.json',
    );
    List productSets = List.from(
            jsonProductSets['data']['searchProductComponentSets']['items'])
        .map((e) => ProductComponentSet.fromJson(e))
        .toList();

    return Map.fromIterable(productSets, key: (v) => v.id, value: (v) => v);
  }

  Future<Map<String, ProductComponent>> _loadAndParseProductComponents() async {
    var jsonProductComponents = await loadJson(
      'test/unit/data/list_product_components_response.json',
    );
    List productSets = List.from(
            jsonProductComponents['data']['searchProductComponents']['items'])
        .map((e) => ProductComponent.fromJson(e))
        .toList();

    return Map.fromIterable(productSets, key: (v) => v.id, value: (v) => v);
  }

  setUpAll(() async {
    _generatedProducts = await _loadAndParseGeneratedProducts();
    log.d('generatedProducts=${_generatedProducts.length}');
    _unitProducts = await _loadAndParseUnitProducts();
    log.d('unitProducts=${_unitProducts.length}');
    _productComponentSets = await _loadAndParseProductComponentSets();
    log.d('productComponentSets=${_productComponentSets.length}');
    _productComponents = await _loadAndParseProductComponents();
    log.d('productComponents=${_productComponentSets.length}');
  });

  group('Generated product conversion from Unit+Chain+Group Product', () {
    String product_id = 'seeded_unit_product_c1_g1_u1_1_id';

    test('Test GeneratedProduct from UnitProducts: basic attributes test',
        () async {
      GeneratedProduct original =
          _generatedProducts.firstWhere((p) => p.id == product_id);
      GeneratedProduct? test1 = getProductFromQuery(
        _unitProducts.firstWhere((p) => p.id == product_id),
        _productComponentSets,
        _productComponents,
      );
      expect(test1, isNotNull);

      expect(original.unitId, equals(test1!.unitId));
      expect(original.id, equals(test1.id));
      expect(original.name, equals(test1.name));
      expect(original.allergens, equals(test1.allergens));

      expect(original.tax, equals(test1.tax));
      expect(
        original.supportedServingModes,
        equals(test1.supportedServingModes),
      );
      expect(original.soldOut, equals(test1.soldOut));
      expect(original.description, equals(test1.description));
      expect(original.image, equals(test1.image));
      expect(original.productType, equals(test1.productType));
      expect(original.position, equals(test1.position));
      expect(original.productCategoryId, equals(test1.productCategoryId));
    });

    test('Test GeneratedProduct from UnitProducts: variants', () async {
      GeneratedProduct original =
          _generatedProducts.firstWhere((p) => p.id == product_id);
      GeneratedProduct? test1 = getProductFromQuery(
        _unitProducts.firstWhere((p) => p.id == product_id),
        _productComponentSets,
        _productComponents,
      );
      // Compare variants
      expect(original.variants.length, equals(test1!.variants.length));
      original.variants.forEach((originalVariant) {
        expect(
          originalVariant,
          equals(
            test1.variants.firstWhere((v) => v.id == originalVariant.id),
          ),
        );
      });
    });

    test('Test GeneratedProduct from UnitProducts: configSets', () async {
      GeneratedProduct original =
          _generatedProducts.firstWhere((p) => p.id == product_id);
      GeneratedProduct? test1 = getProductFromQuery(
        _unitProducts.firstWhere((p) => p.id == product_id),
        _productComponentSets,
        _productComponents,
      );
      // Compare config sets
      expect(original.configSets?.length, equals(test1!.configSets?.length));
      original.configSets?.forEach((originalConfigSet) {
        var testConfigSet = test1.configSets?.firstWhere(
            (cs) => cs.productSetId == originalConfigSet.productSetId);

        originalConfigSet.items.forEach((originalComponent) {
          expect(
              originalComponent,
              testConfigSet?.items.firstWhere((testItem) =>
                  testItem.productComponentId ==
                  originalComponent.productComponentId));
        });
      });
    });
  });
}
