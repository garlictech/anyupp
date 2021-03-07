
// TODO AWS REMOVED
// import 'package:fa_prev/models.dart';
// import 'package:fa_prev/modules/cart/cart.dart';
// import 'package:fa_prev/modules/favorites/favorites.dart';
// import 'package:fa_prev/modules/orders/orders.dart';
// import 'package:fa_prev/shared/auth.dart';
// import 'package:fa_prev/models.dart';
// import 'package:firebase_auth/firebase_auth.dart';
// import 'package:firebase_database/firebase_database.dart';

// // TODO: probably we shouldn't check these on the client
// stringOrMissingToInt(value) {
//   if (value is int) {
//     return value;
//   }

//   if (value == null || value == '') {
//     return 0;
//   }
//   if (value is String) {
//     return int.parse(value);
//   }
// }

// double stringOrMissingToDouble(value) {
//   if (value is int) {
//     return value.toDouble();
//   }

//   if (value == null || value == '') {
//     return 0.0;
//   }
//   if (value is double) {
//     return value;
//   }
//   if (value is String) {
//     return double.parse(value);
//   }

//   return 0.0;
// }

// Map<dynamic, dynamic> missingCheckOnMap(value) {
//   if (value == null) {
//     return {};
//   } else {
//     return value;
//   }
// }

// // TODO ezeket szet kellene szedni modulokra
// class FirebaseModelMapper {
//   static List<ProductCategory> snapshotToProductCategories(DataSnapshot ds) {
//     List<ProductCategory> productCategories =
//         Map<String, dynamic>.from(ds.value).entries.map(FirebaseModelMapper.snapshotToProductCategory).toList();
//     productCategories.sort((a, b) => a.position - b.position);
//     return productCategories;
//   }

//   static List<String> snapshotToNotEmptyProductCategories(DataSnapshot ds) {
//     if (ds.value == null) {
//       return List<String>();
//     }
//     return Map<String, dynamic>.from(ds.value).entries.map((dynamic ds) {
//       return ds.key.toString();
//     }).toList();
//   }

//   static ProductCategory snapshotToProductCategory(dynamic ds) {
//     return ProductCategory(
//         id: ds.key,
//         name: Map<String, String>.from(ds.value['name']),
//         // TODO: could it be missing from the db (null) description: Map<String, String>.from(ds.value['description']),
//         image: ds.value['image'],
//         position: stringOrMissingToInt(ds.value['position']));
//   }

//   static List<FavoriteProduct> snapshotToFavorites(DataSnapshot ds) {
//     if (ds.value == null) {
//       return List<FavoriteProduct>();
//     }

//     List<FavoriteProduct> favorites =
//         Map<String, dynamic>.from(ds.value).entries.map(FirebaseModelMapper.snapshotToFavorite).toList();
//     return favorites;
//   }

//   static FavoriteProduct snapshotToFavorite(MapEntry<String, dynamic> ds) {
//     return FavoriteProduct.fromMap(ds.value);
//   }

//   static List<GeneratedProduct> snapshotToProducts(String categoryId, DataSnapshot ds) {
//     if (ds.value == null) {
//       return List<GeneratedProduct>();
//     }
//     List<GeneratedProduct> products =
//         Map<String, dynamic>.from(ds.value).entries.map(FirebaseModelMapper.snapshotToProduct).toList();
//     products.sort((a, b) => a.position - b.position);
//     products.forEach((element) {
//       element.productCategoryId = categoryId;
//     });
//     return products;
//   }

//   static List<Order> snapshotToPlacedOrders(DataSnapshot ds) {
//     if (ds.value == null) {
//       return List<Order>();
//     }

//     final List<Order> orders = [];

//     Map<String, dynamic>.from(ds.value).forEach((key, value) {
//       Order order = Order.fromMap(value);
//       order.id = key;
//       orders.add(order);
//     });

//     orders.sort((a, b) => b.created.compareTo(a.created));
//     return orders;
//   }

//   static GeneratedProduct snapshotToProduct(dynamic ds) {
//     GeneratedProduct product = GeneratedProduct(
//         id: ds.key,
//         name: Map<String, String>.from(missingCheckOnMap(ds.value['name'])),
//         description: Map<String, String>.from(missingCheckOnMap(ds.value['description'])),
//         image: ds.value['image'],
//         // availability: ds.value['availability'],
//         // isAvailable: ds.value['isAvailable'],
//         isVisible: ds.value['isVisible'],
//         tax: stringOrMissingToInt(ds.value['tax']),
//         position: stringOrMissingToInt(ds.value['position']));

//     // if (ds.value['price'] != null) {
//     //   product.price = Map<String, int>.from(ds.value['price']);
//     // }

//     if (ds.value['contains'] != null) {
//       product.contains = Contains();
//       // TODO: reenable product.contains.allergens =
//       //     Map<String, bool>.from(ds.value['contains']['allergens']);
//     }

//     if (ds.value['variants'] != null) {
//       product.variants = Map<String, dynamic>.from(ds.value['variants'])
//           .entries
//           .map(
//             (entry) => snapshotToVariant(entry),
//           )
//           .toList();
//       product.variants.sort((a, b) => a.position - b.position);
//     }

//     return product;
//   }

//   static Variant snapshotToVariant(dynamic entry) {
//     return Variant(
//       id: entry.key,
//       variantName: Map<String, String>.from(entry.value['variantName']),
//       pack: Pack(
//         size: stringOrMissingToDouble(entry.value['pack']['size']),
//         unit: entry.value['pack']['unit'],
//       ),
//       price: stringOrMissingToDouble(entry.value['price']),
//       position: stringOrMissingToInt(entry.value['position']),
//     );
//   }

//   static User snapshotToUser(DataSnapshot ds) {
//     User user = User(
//       id: ds.key,
//       email: ds.value['email'],
//       phone: ds.value['phone'],
//       profileImage: ds.value['profileImage'],
//       name: ds.value['name'],
//     );
//     if (ds.value['address'] != null) {
//       Map<dynamic, dynamic> address = ds.value['address'];
//       user.address = Address(
//         country: address['country'],
//         postalCode: address['postalCode'],
//         city: address['city'],
//         address: address['address'],
//       );
//     }
//     if (ds.value['orders'] != null) {
//       Map<dynamic, dynamic> orders = ds.value['orders'];
//       user.orders = Orders(
//         active: orders['active'],
//         history: orders['history'] != null ? List<String>.from(orders['history']) : null,
//         pending: orders['pending'] != null ? List<String>.from(orders['pending']) : null,
//       );
//     }
//     return user;
//   }

//   static Cart snapshotToCart(DataSnapshot ds) {
//     return Cart.fromMap(ds.value);
//   }

//   static Order snapshotToOrder(Map<String, dynamic> snapshot) {
//     return Order.fromMap(snapshot);
//   }

//   //
//   // Convert firebaseUser to AuthenticatedUser
//   static AuthenticatedUser firebaseUsertoAuthenticatedUser(FirebaseUser firebaseUser) {
//     if (firebaseUser != null) {
//       return AuthenticatedUser(
//           id: firebaseUser.uid,
//           displayName: firebaseUser.displayName,
//           email: firebaseUser.email,
//           photoUrl: firebaseUser.photoUrl);
//     }
//     return null;
//   }

//   static User firebaseUserToUser(FirebaseUser firebaseUser, [String displayName]) {
//     return User.fromMap(firebaseUserToDBUser(firebaseUser, displayName));
//   }

//   static Map firebaseUserToDBUser(FirebaseUser firebaseUser, String displayName) {
//     return {
//       'name': displayName != null ? displayName : firebaseUser.displayName,
//       'email': firebaseUser.email,
//       'profileImage': firebaseUser.photoUrl,
//       'phone': firebaseUser.phoneNumber,
//       'address': {
//         'address': '-',
//         'city': '-',
//         'country': '-',
//         'name': '-',
//         'postalCode': '-',
//         'location': {'lat': 0.0, 'lng': 0.0}
//       }
//     };
//   }
// }

// extension UserToMapFormat on User {
//   ///
//   /// Convert User model to it's MAP representation
//   Map toMap() {
//     return {
//       'name': this.name,
//       'email': this.email,
//       'phone': this.phone,
//       'address': {'address': '-', 'city': '-', 'country': '-', 'name': '-', 'postalCode': '-'}
//     };
//   }
// }
