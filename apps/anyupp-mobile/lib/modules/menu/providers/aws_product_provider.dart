import 'dart:convert';

import 'package:amplify_flutter/amplify.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/models/ProductCategory.dart';
import 'package:amplify_api/amplify_api.dart';

import 'package:fa_prev/models/GeneratedProduct.dart';

import 'product_provider_interface.dart';
import 'package:fa_prev/graphql/graphql.dart';

class AwsProductProvider implements IProductProvider {
  @override
  Stream<List<ProductCategory>> getProductCategoryList(String chainId, String unitId) {
    print('***** getProductCategoryList().start().chainId=$chainId, unitId=$unitId');
    return _getWithGraphQL(chainId, unitId);
  }

  Stream<List<ProductCategory>> _getWithGraphQL(String chainId, String unitId) async* {
    try {
      var operation = Amplify.API.query(
        request: GraphQLRequest<String>(
          document: QUERY_LIST_PRODUCT_CATEGORIES,
          variables: {'unitId': unitId},
        ),
      );

      var response = await operation.response;
      var data = response.data;
      //print('***** getProductCategoryList().data=$data');
      Map<String, dynamic> json = jsonDecode(data);
      // print('***** getProductCategoryList().json=$json');

      List<dynamic> items = json['listProductCategorys']['items'];
      //print('***** searchUnitsNearLocation().items=$items, length=${items?.length}');
      List<ProductCategory> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          results.add(ProductCategory.fromJson(Map<String, dynamic>.from(items[i])));
        }
      }

      yield results;
    } on ApiException catch (e) {
      print('AwsUnitProvider.getProductCategoryList.Exception: $e');
      rethrow;
    }
  }

  @override
  Stream<List<GeneratedProduct>> getProductList(String unitId, String categoryId) async* {
    print('***** getProductList().start().unitId=$unitId, categoryId=$categoryId');
    try {
      var operation = Amplify.API.query(
        request: GraphQLRequest<String>(
          document: QUERY_LIST_PRODUCTS,
          variables: {
            'unitId': unitId,
            'categoryId': categoryId,
          },
        ),
      );

      var response = await operation.response;
      var data = response.data;
      print('***** getProductList().data=$data');
      Map<String, dynamic> json = jsonDecode(data);

      List<dynamic> items = json['listGeneratedProducts']['items'];
      List<GeneratedProduct> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          results.add(GeneratedProduct.fromJson(Map<String, dynamic>.from(items[i])));
          // Map<String, dynamic> jsonProd = Map<String, dynamic>.from(items[i]);
          // // print('***** getProductList().json[variants] is List=${(jsonProd["variants"] is List)} type=${jsonProd["variants"]}');
          // GeneratedProduct product = GeneratedProduct.fromJson(jsonProd);
          // results.add(product);
          // print('**** GeneratedProduct added:$product');
          // print('**** GeneratedProduct added.variants:${product.variants}');
        }
      }

      yield results;
    } on ApiException catch (e) {
      print('AwsUnitProvider.getProductList.Exception: $e');
      rethrow;
    }
  }

  // Stream<List<ProductCategory>> _getWithDataStore(String chainId, String unitId) async* {
  //   try {
  //     List<ProductCategory> categories =
  //         await Amplify.DataStore.query(ProductCategory.classType, where: ProductCategory.UNITID.eq(unitId));
  //     print('***** getProductCategoryList().categories=$categories');
  //     if (categories != null) {
  //       List<ProductCategory> results = [];
  //       for (int i = 0; i < categories.length; i++) {
  //         ProductCategory category = categories[i];
  //         LocalizedItem name =
  //             (await Amplify.DataStore.query(LocalizedItem.classType, where: LocalizedItem.ID.eq(category.nameId)))[0];
  //         LocalizedItem desc = (await Amplify.DataStore.query(LocalizedItem.classType,
  //             where: LocalizedItem.ID.eq(category.descriptionId)))[0];
  //         results.add(ProductCategory(
  //           id: category.id,
  //           image: category.image,
  //           description: desc,
  //           descriptionId: category.descriptionId,
  //           name: name,
  //           nameId: category.nameId,
  //           position: category.position,
  //           unitId: unitId,
  //         ));
  //       }

  //       print('***** getProductCategoryList().results=$results');
  //       yield results;
  //       return;
  //     }
  //     yield null;
  //   } on Exception catch (e) {
  //     print('**** getProductCategoryList().error=$e');
  //     rethrow;
  //   }
  // }

  // @override
  // Stream<List<GeneratedProduct>> getProductList(String unitId, String categoryId) async* {
  //   print('**** getProductList().start().unitId=$unitId, categoryId=$categoryId');
  //   try {
  //     List<GeneratedProduct> products = await Amplify.DataStore.query(
  //       GeneratedProduct.classType,
  //       where: GeneratedProduct.UNITID.eq(unitId).and(GeneratedProduct.PRODUCTCATEGORYID.eq(categoryId)),
  //     );
  //     print('**** getProductList().products=$products');
  //     if (products != null) {
  //       List<GeneratedProduct> productRes = [];
  //       for (int i = 0; i < products.length; i++) {
  //         GeneratedProduct p = products[i];
  //         // print('**** getProductList()[$i].description=${p.description}');
  //         LocalizedItem name = (await Amplify.DataStore.query(
  //           LocalizedItem.classType,
  //           where: LocalizedItem.ID.eq(p.nameId),
  //         ))[0];
  //         LocalizedItem desc = (await Amplify.DataStore.query(
  //           LocalizedItem.classType,
  //           where: LocalizedItem.ID.eq(p.descriptionId),
  //         ))[0];

  //         List<ProductVariant> variants = await Amplify.DataStore.query(
  //           ProductVariant.classType,
  //           where: ProductVariant.PRODUCTID.eq(p.id),
  //         );

  //         List<ProductVariant> variantsRes = [];

  //         if (variants != null) {
  //           for (int j = 0; j < variants.length; j++) {
  //             ProductVariant v = variants[j];
  //             LocalizedItem variantName = (await Amplify.DataStore.query(
  //               LocalizedItem.classType,
  //               where: LocalizedItem.ID.eq(v.variantNameId),
  //             ))[0];
  //             ProductVariantPack pack = (await Amplify.DataStore.query(
  //               ProductVariantPack.classType,
  //               where: ProductVariantPack.ID.eq(v.packId),
  //             ))[0];

  //             variantsRes.add(ProductVariant(
  //               id: v.id,
  //               isAvailable: v.isAvailable,
  //               productId: v.productId,
  //               price: v.price,
  //               position: v.position,
  //               packId: v.packId,
  //               pack: pack,
  //               variantName: variantName,
  //               variantNameId: v.variantNameId,
  //             ));
  //           }
  //         }

  //         productRes.add(GeneratedProduct(
  //           id: p.id,
  //           nameId: p.nameId,
  //           name: name,
  //           descriptionId: p.descriptionId,
  //           description: desc,
  //           variants: variantsRes,
  //           image: p.image,
  //           productCategoryId: p.productCategoryId,
  //           productType: p.productType,
  //           position: p.position,
  //           unitId: p.unitId,
  //           extending: p.extending,
  //           isVisible: p.isVisible,
  //           tax: p.tax,
  //         ));
  //       }
  //       yield productRes;
  //       return;
  //     }
  //     yield [];
  //   } on Exception catch (e) {
  //     print('**** getProductCategoryList().error=$e');
  //     rethrow;
  //   }
  // }
}
