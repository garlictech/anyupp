// TODO AWS REMOVED
// import 'dart:async';

// import 'package:fa_prev/shared/auth.dart';
// import 'package:fa_prev/models.dart';
// import 'package:fa_prev/shared/utils/firebase_model_mapper.dart';
// import 'package:firebase_database/firebase_database.dart';
// import 'package:rxdart/rxdart.dart';

// import 'package:fa_prev/modules/favorites/favorites.dart';

// class FirebaseFavoritesProvider implements IFavoritesProvider {
//   final DatabaseReference _dbRef;
//   final FirebaseAuthProvider _authProvider;

//   FirebaseFavoritesProvider(this._dbRef, this._authProvider);

//   @override
//   Stream<List<Product>> getFavoritesList(String chainId, String unitId) {
//     return _authProvider.getAuthenticatedUserProfile().asStream().switchMap((user) => _dbRef
//         .child('favorites')
//         .child('chains')
//         .child(chainId)
//         .child('units')
//         .child(unitId)
//         .child('users')
//         .child(user.id)
//         .onValue
//         .map((event) => event.snapshot)
//         .map((favoriteProducts) => FirebaseModelMapper.snapshotToFavorites(favoriteProducts))
//         .switchMap((List<FavoriteProduct> favoriteProducts) => _createProductLoadStream(chainId, unitId, favoriteProducts)));

//     // .where((snapshot) => snapshot.value != null)
//     //.map((snapshot) => snapshot.value != null ? Map<String, dynamic>.from(snapshot.value).values.toList() : null)
//     //.switchMap((List<dynamic> keys) => _createProductLoadStream(chainId, unitId, keys)));
//   }

//   Stream<List<Product>> _createProductLoadStream(String chainId, String unitId, List<FavoriteProduct> products) {
//     if (products == null) {
//       return Stream.value(List<Product>());
//     }

//     List<Future<Product>> futures = [];
//     for (var product in products) {
//       futures.add(_createProductLoadFuture(chainId, unitId, product));
//     }
//     return Future.wait(futures).asStream();
//   }

//   Future<Product> _createProductLoadFuture(String chainId, String unitId, FavoriteProduct favorite) async {
//     DataSnapshot snapshot = await _dbRef
//         .child('generated')
//         .child('productList')
//         .child('units')
//         .child(unitId)
//         .child('productCategories')
//         .child(favorite.categoryId)
//         .child('products')
//         .child(favorite.productId)
//         .once();
//     Product product = FirebaseModelMapper.snapshotToProduct(snapshot);
//     product.productCategoryId = favorite.categoryId;
//     return product;
//   }

//   @override
//   Future<bool> addOrRemoveFavoriteProduct(String chainId, String unitId, String categoryId, String productId) async {
//     // print('addOrRemoveFavoriteProduct start()=$chainId, $unitId, $productId');
//     User user = await _authProvider.getAuthenticatedUserProfile();

//     DataSnapshot existing = await _getFavoritesRootDbReference(chainId, unitId, user.id, productId).once();

//     if (existing?.value != null) {
//       print('addOrRemoveFavoriteProduct.DELETING=$productId');
//       await _getFavoritesRootDbReference(chainId, unitId, user.id, productId).remove();

//       return false;
//     }

//     print('addOrRemoveFavoriteProduct.ADDING=$productId');

//     await _getFavoritesRootDbReference(chainId, unitId, user.id, productId).update({
//       'productId': productId,
//       'categoryId': categoryId,
//     });
//     return true;
//   }

//   DatabaseReference _getFavoritesRootDbReference(String chainId, String unitId, String userId, String productId) {
//     return _dbRef
//         .child('favorites')
//         .child('chains')
//         .child(chainId)
//         .child('units')
//         .child(unitId)
//         .child('users')
//         .child(userId)
//         .child(productId);
//   }

//   @override
//   Future<bool> checkIfProductIsFavorite(String chainId, String unitId, String productId) async {
//     User user = await _authProvider.getAuthenticatedUserProfile();
//     DataSnapshot snapshot = await _getFavoritesRootDbReference(chainId, unitId, user.id, productId).once();

//     return snapshot?.value != null;
//   }
// }
