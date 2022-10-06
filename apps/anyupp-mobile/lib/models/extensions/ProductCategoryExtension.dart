import 'package:anyupp/models/NestedSortItem.dart';
import 'package:anyupp/models/Unit.dart';

import '../ProductCategory.dart';

extension ProductCategoryExtension on ProductCategory {
  String? getParentId(Unit unit) {
    // temp todo
/*    if ("seeded_product_category_c1_2_id" == id) {
      return "seeded_product_category_c1_4_id";
    }
    if ("seeded_product_category_c1_3_id" == id) {
      return "seeded_product_category_c1_4_id";
    }*/

    if (unit.categoryOrders != null) {
      for (NestedSortItem nestedSortItem in unit.categoryOrders!) {
        if (nestedSortItem.id == this.id) {
          return nestedSortItem.parentId;
        }
      }
    }
    return null;
  }
}
