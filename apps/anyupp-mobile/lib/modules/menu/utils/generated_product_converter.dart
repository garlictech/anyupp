import 'package:collection/collection.dart';
import '/models.dart';
import '/graphql/generated/crud-api.dart';

typedef UnitProduct = ListAllProducts$Query$SearchUnitProducts$Items;
// = ListAllProducts$Query$SearchableUnitProductConnection$UnitProduct;
typedef ProductComponentSet
    = ListChainProductComponentSets$Query$SearchProductComponentSets$Items;
// = ListChainProductComponentSets$Query$SearchableProductComponentSetConnection$ProductComponentSet;

typedef ProductComponent
    = ListChainProductComponents$Query$SearchProductComponents$Items;
// = ListChainProductComponents$Query$SearchableProductComponentConnection$ProductComponent;

typedef Variant = ListAllProducts$Query$SearchUnitProducts$Items$Variants;

GeneratedProduct? getProductFromQuery(
  UnitProduct data,
  Map<String, ProductComponentSet> componentSets,
  Map<String, ProductComponent> components,
) {
  // If product is not visible in any level => return null
  if (!data.isVisible) {
    return null;
  }

  // Create generated product
  return GeneratedProduct(
      id: data.id,
      unitId: data.unitId,
      productCategoryId: data.productCategoryId,
      name: LocalizedItem(
        hu: data.name.hu,
        en: data.name.en,
        de: data.name.de,
      ),
      description: data.description != null
          ? LocalizedItem(
              hu: data.description?.hu,
              en: data.description?.en,
              de: data.description?.de,
            )
          : null,
      productType: data.productType,
      tax: data.tax,
      position: data.position,
      image: data.image,
      supportedServingModes:
          data.supportedServingModes ?? [ServingMode.inPlace],
      allergens: data.allergens?.whereNotNull().toList(),
      soldOut: false,
      variants: data.variants!
          .asMap()
          .entries
          .map((entry) {
            var variant = entry.value;
            var groupVariant = data.variants?[entry.key];
            var chainVariant = data.variants?[entry.key];

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
