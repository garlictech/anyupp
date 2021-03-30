// import 'dart:convert';
// import 'package:fa_prev/models.dart';
// import 'package:fa_prev/modules/login/login.dart';
// import 'package:fa_prev/models.dart';

// class User {
//   String id;
//   String name;
//   String email;
//   String phone;
//   String profileImage;
//   Address address;
//   LoginMethod login;
//   Map<String, Payment> payment;
//   Map<String, Role> roles;
//   Map<String, Social> social;
//   Orders orders;

//   User(
//       {this.id,
//       this.name,
//       this.email,
//       this.phone,
//       this.profileImage,
//       this.address,
//       this.payment,
//       this.login,
//       this.roles,
//       this.social,
//       this.orders});

//   Map<String, dynamic> toMap() {
//     return {
//       'id': id,
//       'name': name,
//       'email': email,
//       'phone': phone,
//       'profileImage': profileImage,
//       'address': address?.toJson(),
//       'payment': payment,
//       'roles': roles,
//       'social': social,
//       'orders': orders?.toMap(),
//       'login': login.toString(),
//     };
//   }

//   static User fromMap(Map<dynamic, dynamic> map) {
//     if (map == null) return null;

//     User user;
//     try {
//       user = User(
//         id: map['id'],
//         name: map['name'],
//         email: map['email'],
//         phone: map['phone'],
//         profileImage: map['profileImage'],
//         address: Address.fromJson(map['address']),
//         payment: Map<String, Payment>.from(map['payment']),
//         roles: Map<String, Role>.from(map['roles']),
//         social: Map<String, Social>.from(map['social']),
//         orders: Orders.fromMap(map['orders']),
//         login:  LoginMethod.values.firstWhere((value) => value == map['provider'], orElse: () => LoginMethod.UNKNOWN),
//       );
//       // print('***** User.fromMap().user=$user');
//     } on Error catch(e) {
//       print('****** User.fromMap().Error parsing user=$e');
//     } on Exception catch(e) {
//       print('****** User.fromMap().Error parsing user=$e');
//     }

//     return user;
//   }

//   String toJson() => json.encode(toMap());

//   static User fromJson(String source) => fromMap(json.decode(source));

//   @override
//   String toString() {
//     return 'User(id: $id, name: $name, email: $email, phone: $phone, profileImage: $profileImage, login: $login, address: $address, payment: $payment, roles: $roles, social: $social, orders: $orders)';
//   }
// }

// // TODO ezeket ki lehetne vinni kulon class-ba, itt lokalisan
// class Orders {
//   String active;
//   List<String> history;
//   List<String> pending;

//   Orders({
//     this.active,
//     this.history,
//     this.pending,
//   });

//   Map<String, dynamic> toMap() {
//     return {
//       'active': active,
//       'history': history,
//       'pending': pending,
//     };
//   }

//   static Orders fromMap(Map<dynamic, dynamic> map) {
//     if (map == null) return null;

//     return Orders(
//       active: map['active'],
//       history: List<String>.from(map['history']),
//       pending: List<String>.from(map['pending']),
//     );
//   }

//   String toJson() => json.encode(toMap());

//   static Orders fromJson(String source) => fromMap(json.decode(source));

//   @override
//   String toString() => 'Orders(active: $active, history: $history, pending: $pending)';
// }


// class Social {
//   String provider;
//   String accountId;

//   Social({
//     this.provider,
//     this.accountId,
//   });

//   Map<String, dynamic> toMap() {
//     return {
//       'provider': provider,
//       'accountId': accountId,
//     };
//   }

//   static Social fromMap(Map<dynamic, dynamic> map) {
//     if (map == null) return null;

//     return Social(
//       provider: map['provider'],
//       accountId: map['accountId'],
//     );
//   }

//   String toJson() => json.encode(toMap());

//   static Social fromJson(String source) => fromMap(json.decode(source));

//   @override
//   String toString() => 'Social(provider: $provider, accountId: $accountId)';
// }

// class Role {
//   String id;
//   Map<String, bool> roles;
//   Role({
//     this.id,
//     this.roles,
//   });

//   Map<String, dynamic> toMap() {
//     return {
//       'id': id,
//       'roles': roles,
//     };
//   }

//   static Role fromMap(Map<dynamic, dynamic> map) {
//     if (map == null) return null;

//     return Role(
//       id: map['id'],
//       roles: Map<String, bool>.from(map['roles']),
//     );
//   }

//   String toJson() => json.encode(toMap());

//   static Role fromJson(String source) => fromMap(json.decode(source));

//   @override
//   String toString() => 'Role(id: $id, roles: $roles)';
// }
