// TODO AWS REMOVED
// import 'package:fa_prev/core/core.dart';
// import 'package:fa_prev/modules/orders/orders.dart';
// import 'package:fa_prev/shared/auth.dart';
// import 'package:fa_prev/shared/providers.dart';
// import 'package:fa_prev/shared/utils/firebase_model_mapper.dart';
// import 'package:firebase_database/firebase_database.dart';
// import 'dart:async';
// import 'package:rxdart/rxdart.dart';

// import 'package:fa_prev/modules/cart/cart.dart';

// import 'cart_provider_interface.dart';

// class FirebaseCartProvider implements ICartProvider {
  
//   final DatabaseReference _dbRef;
//   final FirebaseAuthProvider _authProvider;
//   final FirebaseFunctionsProvider _firebaseFunctionsProvider;

//   FirebaseCartProvider(this._dbRef, this._authProvider, this._firebaseFunctionsProvider);

//   @override
//   Future<Cart> getCurrentCart(String chainId, String unitId) async {
//     User user = await _authProvider.getAuthenticatedUserProfile();

//     DataSnapshot snapshot = await _dbRef
//         .child('carts')
//         .child('chains')
//         .child(chainId)
//         .child('units')
//         .child(unitId)
//         .child('users')
//         .child(user.id)
//         .once();
//     if (snapshot != null) {
//       return FirebaseModelMapper.snapshotToCart(snapshot);
//     }

//     return null;
//   }

//   @override
//   Stream<Cart> getCurrentCartStream(String chainId, String unitId) {
//     return _authProvider.getAuthenticatedUserProfileStream().switchMap((user) => _dbRef
//         .child('carts')
//         .child('chains')
//         .child(chainId)
//         .child('units')
//         .child(unitId)
//         .child('users')
//         .child(user.id)
//         .onValue
//         .map((event) => event.snapshot.value)
//         .map((value) => Cart.fromMap(value)));
//   }

//     @override
//     Future<void> updateCart(String chainId, String unitId, Cart cart) async {
//     // print('***** updateCart()=[/chains/$chainId/units/$unitId].cart=$cart');
//     User user = await _authProvider.getAuthenticatedUserProfile();
//     return _dbRef
//         .child('carts')
//         .child('chains')
//         .child(chainId)
//         .child('units')
//         .child(unitId)
//         .child('users')
//         .child(user.id)
//         .update(cart.toMap());
//   }

//   @override
//   Future<void> clearCart(String chainId, String unitId) async {
//     // print('***** clearCart()=[/chains/$chainId/units/$unitId]');
//     User user = await _authProvider.getAuthenticatedUserProfile();
//     return _dbRef
//         .child('carts')
//         .child('chains')
//         .child(chainId)
//         .child('units')
//         .child(unitId)
//         .child('users')
//         .child(user.id)
//         .remove();
//   }

//   @override
//   Stream<List<PlacedOrder>> getCurrentOrders(String chainId, String unitId) {
//     return _authProvider.getAuthenticatedUserProfileStream().switchMap((user) => _getRef(chainId, unitId, user.id)
//         .child('active')
//         .onValue
//         .map((event) => event.snapshot)
//         .map(FirebaseModelMapper.snapshotToPlacedOrders));
//   }

//   @override
//   Stream<List<PlacedOrder>> getOrderHistory(String chainId, String unitId) {
//     return _authProvider.getAuthenticatedUserProfileStream().switchMap((user) => _getRef(chainId, unitId, user.id)
//         .child('history')
//         .onValue
//         .map((event) => event.snapshot)
//         .map(FirebaseModelMapper.snapshotToPlacedOrders));
//   }

//   DatabaseReference _getRef(String chainId, String unitId, String userId) {
//     return _dbRef
//         .child('orders')
//         .child('chains')
//         .child(chainId)
//         .child('units')
//         .child(unitId)
//         .child('users')
//         .child(userId);
//   }

//   @override
//   Future<void> createAndSendOrderFromCart(GeoUnit unit, String paymentMethod) async {
//     await this._firebaseFunctionsProvider.createOrderFromCart({
//       'chainId': unit.chainId,
//       'unitId': unit.unitId,
//       'paymentMethod': paymentMethod,
//       'userLocation': {
//         'lat': unit.address?.location?.latitude, // TODO ez tenyleg nem jo, thx Gyuri! Ide az user pozicioja kell, nem a unite
//         'lng': unit.address?.location?.longitude,
//       }
//     });
//   }
 
// }
