// import 'dart:convert';

// class FavoriteProduct {
//   String categoryId;
//   String productId;

//   FavoriteProduct({
//     this.categoryId,
//     this.productId,
//   });


//   FavoriteProduct copyWith({
//     String categoryId,
//     String productId,
//   }) {
//     return FavoriteProduct(
//       categoryId: categoryId ?? this.categoryId,
//       productId: productId ?? this.productId,
//     );
//   }

//   Map<String, dynamic> toMap() {
//     return {
//       'categoryId': categoryId,
//       'productId': productId,
//     };
//   }

//   static FavoriteProduct fromMap(Map<dynamic, dynamic> map) {
//     if (map == null) return null;
  
//     return FavoriteProduct(
//       categoryId: map['categoryId'],
//       productId: map['productId'],
//     );
//   }

//   String toJson() => json.encode(toMap());

//   static FavoriteProduct fromJson(String source) => fromMap(json.decode(source));

//   @override
//   String toString() => 'FavoriteProduct(categoryId: $categoryId, productId: $productId)';

//   @override
//   bool operator ==(Object o) {
//     if (identical(this, o)) return true;
  
//     return o is FavoriteProduct &&
//       o.categoryId == categoryId &&
//       o.productId == productId;
//   }

//   @override
//   int get hashCode => categoryId.hashCode ^ productId.hashCode;
// }
