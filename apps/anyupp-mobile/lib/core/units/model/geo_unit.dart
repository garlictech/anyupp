import 'dart:convert';

import 'package:fa_prev/shared/models.dart';
import 'package:fa_prev/shared/utils/firebase_conversion_utils.dart';

import 'unit_style.dart';

class GeoUnit {
  String chainId;
  String groupId;
  String unitId;
  String name;
  UnitStyle style;
  int distance;
  Address address;
  String openingHours;
  String currency;
  List<String> paymentModes;
  Place place;

  GeoUnit({
    this.chainId,
    this.groupId,
    this.unitId,
    this.name,
    this.style,
    this.distance,
    this.address,
    this.openingHours,
    this.currency,
    this.paymentModes,
    this.place,
  });

  Map<String, dynamic> toMap() {
    return {
      'chainId': chainId,
      'groupId': groupId,
      'unitId': unitId,
      'name': name,
      'style': style,
      'distance': distance,
      'address': address?.toMap(),
      'openingHours': openingHours,
      'currency': currency,
      'paymentModes': paymentModes,
      'place': place?.toMap(),
    };
  }

  factory GeoUnit.fromMap(Map<String, dynamic> map) {
    if (map == null) return null;

    return GeoUnit(
      chainId: map['chainId'],
      groupId: map['groupId'],
      unitId: map['unitId'],
      name: map['name'],
      style: UnitStyle.fromMap(map['style']),
      distance: getIntFromFirebaseValue(map['distance']),
      address: Address.fromMap(map['address']),
      openingHours: map['openingHours'],
      currency: map['currency'],
      paymentModes: List<String>.from(map['paymentModes']),
      place: Place.fromMap(map['place']),
    );
  }

  String toJson() => json.encode(toMap());

  factory GeoUnit.fromJson(String source) => GeoUnit.fromMap(json.decode(source));

  @override
  String toString() {
    return 'GeoUnit(chainId: $chainId, groupId: $groupId, unitId: $unitId, name: $name, style: $style, distance: $distance, address: $address, openingHours: $openingHours, currency: $currency, paymentModes: $paymentModes, place: $place)';
  }
}
