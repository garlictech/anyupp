import 'package:anyupp/models/NestedSortItem.dart';
import 'package:anyupp/models/Unit.dart';

import '../ProductCategory.dart';

extension ProductCategoryExtension on ProductCategory {
  /// returns parent category based on unit.categoryOrders
  String? getParentId(Unit unit) {
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
