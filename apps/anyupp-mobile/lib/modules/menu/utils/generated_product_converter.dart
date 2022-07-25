import 'package:fa_prev/core/logger.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:collection/collection.dart';

typedef UnitProduct = ListAllProducts$Query$SearchUnitProducts$Items;
// = ListAllProducts$Query$SearchableUnitProductConnection$UnitProduct;
typedef ProductComponentSet
    = ListChainProductComponentSets$Query$SearchProductComponentSets$Items;
// = ListChainProductComponentSets$Query$SearchableProductComponentSetConnection$ProductComponentSet;

typedef ProductComponent
    = ListChainProductComponents$Query$SearchProductComponents$Items;
// = ListChainProductComponents$Query$SearchableProductComponentConnection$ProductComponent;

typedef Variant
    = ListAllProducts$Query$SearchableUnitProductConnection$UnitProduct$ProductVariant;

GeneratedProduct? getProductFromQuery(
  UnitProduct data,
  Map<String, ProductComponentSet> componentSets,
  Map<String, ProductComponent> components,
) {
  var chainProduct = data.groupProduct?.chainProduct!;
  var groupProduct = data.groupProduct;

  // If no chain or group product => return null
  if (chainProduct == null || groupProduct == null) {
    return null;
  }

  // If product is not visible in any level => return null
  if (!data.isVisible && !groupProduct.isVisible && !chainProduct.isVisible) {
    return null;
  }

  // Create generated product
  return GeneratedProduct(
      id: data.id,
      unitId: data.unitId,
      productCategoryId: chainProduct.productCategoryId,
      name: LocalizedItem(
        hu: chainProduct.name.hu,
        en: chainProduct.name.en,
        de: chainProduct.name.de,
      ),
      description: chainProduct.description != null
          ? LocalizedItem(
              hu: chainProduct.description?.hu,
              en: chainProduct.description?.en,
              de: chainProduct.description?.de,
            )
          : null,
      productType: chainProduct.productType,
      tax: groupProduct.tax,
      position: data.position,
      image: chainProduct.image,
      supportedServingModes:
          data.supportedServingModes ?? [ServingMode.inPlace],
      allergens: chainProduct.allergens?.whereNotNull().toList(),
      soldOut: false,
      variants: data.variants!
          .asMap()
          .entries
          .map((entry) {
            var variant = entry.value;
            var groupVariant = groupProduct.variants?[entry.key];
            var chainVariant = chainProduct.variants?[entry.key];

            if (variant == null ||
                groupVariant == null ||
                chainVariant == null) {
              return null;
            }

            return ProductVariant(
              variantName: LocalizedItem(
                hu: variant.variantName.hu,
                en: variant.variantName.en,
                de: variant.variantName.de,
              ),
              price: _getVariantPrice(variant),
              position: variant.position,
              soldOut: variant.soldOut ?? false,
              id: variant.id,
              netPackagingFee: variant.netPackagingFee,
              pack: ProductVariantPack(
                size: variant.pack?.size ??
                    groupVariant.pack?.size ??
                    chainVariant.pack?.size ??
                    0,
                unit: variant.pack?.unit ??
                    groupVariant.pack?.unit ??
                    chainVariant.pack?.unit ??
                    '',
              ),
            );
          })
          .whereNotNull()
          .toList(),
      configSets: _getConfigSet(
        data,
        components,
        componentSets,
      ));
}

_getConfigSet(
  UnitProduct data,
  Map<String, ProductComponent> components,
  Map<String, ProductComponentSet> componentSets,
) {
  var unitProductCS = data.configSets;
  if (unitProductCS?.isNotEmpty == false) {
    return null;
  }
  List<GeneratedProductConfigSet> results = [];
  for (int i = 0; i < unitProductCS!.length; i++) {
    var componentSet = componentSets[unitProductCS[i]!.productSetId];
    assert(componentSet != null);
    if (componentSet == null) {
      continue;
    }
    results.add(GeneratedProductConfigSet(
      name: LocalizedItem(
        hu: componentSet.name.hu,
        en: componentSet.name.en,
        de: componentSet.name.de,
      ),
      externalId: componentSet.externalId,
      productSetId: componentSet.id,
      supportedServingModes:
          componentSet.supportedServingModes ?? [ServingMode.inPlace],
      description: componentSet.description,
      type: componentSet.type,
      items: unitProductCS[i]!
          .items
          .map((item) {
            var component = components[item.productComponentId];
            // assert(component != null);
            if (component == null) {
              return null;
            }
            return GeneratedProductConfigComponent(
              productComponentId: component.id,
              name: LocalizedItem(
                hu: component.name.hu,
                en: component.name.en,
                de: component.name.de,
              ),
              position: item.position,
              price: item.price > 0 ? item.price : item.refGroupPrice,
              soldOut: component.soldOut ?? false,
              externalId: item.externalId,
              netPackagingFee: item.netPackagingFee,
              allergens: component.allergens?.whereNotNull().toList(),
            );
          })
          .whereNotNull()
          .toList(),
    ));
  }
  return results;
}

double _getVariantPrice(Variant item) {
  if (item.availabilities?.isNotEmpty == true) {
    return item.availabilities!.first!.price;
  }
  return item.price;
}
