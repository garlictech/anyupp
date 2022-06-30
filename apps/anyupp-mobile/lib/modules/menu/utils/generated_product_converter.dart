import 'package:fa_prev/models.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:collection/collection.dart';

GeneratedProduct? getProductFromQuery(
  ListAllProducts$Query$SearchableUnitProductConnection$UnitProduct data,
  Map<String,
          ListChainProductComponentSets$Query$SearchableProductComponentSetConnection$ProductComponentSet>
      componentSets,
  Map<String,
          ListChainProductComponents$Query$SearchableProductComponentConnection$ProductComponent>
      components,
) {
  var chainProduct = data.groupProduct?.chainProduct!;
  var groupProduct = data.groupProduct;

  if (chainProduct == null || groupProduct == null) {
    return null;
  }

  return GeneratedProduct(
      id: data.id,
      unitId: data.unitId,
      productCategoryId: chainProduct.productCategoryId,
      name: LocalizedItem(
        hu: chainProduct.name.hu,
        en: chainProduct.name.en,
        de: chainProduct.name.de,
      ),
      description: LocalizedItem(
        hu: chainProduct.description?.hu,
        en: chainProduct.description?.en,
        de: chainProduct.description?.de,
      ),
      productType: chainProduct.productType,
      tax: groupProduct.tax,
      position: data.position,
      image: chainProduct.image,
      supportedServingModes:
          data.supportedServingModes ?? [ServingMode.inPlace],
      allergens: chainProduct.allergens?.whereNotNull().toList(),
      soldOut: false,
      variants: data.variants!.asMap().entries.map((entry) {
        var variant = entry.value;
        var groupVariant = groupProduct.variants?[entry.key];
        var chainVariant = chainProduct.variants?[entry.key];
        return ProductVariant(
          variantName: LocalizedItem(
            hu: variant?.variantName.hu,
            en: variant?.variantName.en,
            de: variant?.variantName.de,
          ),
          price: variant!.price,
          position: variant!.position,
          soldOut: variant.soldOut ?? false,
          id: variant.id,
          netPackagingFee: variant.netPackagingFee,
          pack: ProductVariantPack(
            size: variant.pack?.size ??
                groupVariant?.pack?.size ??
                chainVariant?.pack?.size ??
                0,
            unit: variant.pack?.unit ??
                groupVariant?.pack?.unit ??
                chainVariant?.pack?.unit ??
                '',
          ),
        );
      }).toList(),
      configSets: _getConfigSet(
        data,
        components,
        componentSets,
      ));
}

_getConfigSet(
  ListAllProducts$Query$SearchableUnitProductConnection$UnitProduct data,
  Map<String,
          ListChainProductComponents$Query$SearchableProductComponentConnection$ProductComponent>
      components,
  Map<String,
          ListChainProductComponentSets$Query$SearchableProductComponentSetConnection$ProductComponentSet>
      componentSets,
) {
  var unitProductCS = data.configSets;
  var groupProductCS = data.groupProduct?.configSets;
  var chainProductCS = data.groupProduct?.chainProduct?.configSets;
  if (unitProductCS == null ||
      groupProductCS == null ||
      chainProductCS == null) {
    return null;
  }
  assert(unitProductCS.length == groupProductCS.length);
  assert(groupProductCS.length == chainProductCS.length);
  List<GeneratedProductConfigSet> results = [];
  for (int i = 0; i < unitProductCS.length; i++) {
    var componentSet = componentSets[unitProductCS[i]!.productSetId];
    assert(componentSet != null);
    results.add(GeneratedProductConfigSet(
      name: LocalizedItem(
        hu: componentSet?.name.hu,
        en: componentSet?.name.en,
        de: componentSet?.name.de,
      ),
      productSetId: componentSet!.id,
      supportedServingModes:
          componentSet!.supportedServingModes ?? [ServingMode.inPlace],
      description: componentSet.description,
      type: componentSet.type,
      items: unitProductCS[i]!.items.map((item) {
        var component = components[item.productComponentId];
        assert(component != null);
        return GeneratedProductConfigComponent(
          productComponentId: component!.id,
          name: LocalizedItem(
            hu: component.name.hu,
            en: component.name.en,
            de: component.name.de,
          ),
          position: item.position,
          price: item.price,
          soldOut: component.soldOut ?? false,
          externalId: item.externalId,
          netPackagingFee: item.netPackagingFee,
          allergens: component.allergens?.whereNotNull().toList(),
        );
      }).toList(),
    ));
  }
  return results;
}
