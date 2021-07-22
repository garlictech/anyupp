import 'package:collection/collection.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/models/OpeningHours.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';

@immutable
class GeoUnit extends Model {
  final String id;
  final String groupId;
  final String chainId;
  final String name;
  final Address address;
  final ChainStyle style;
  final List<PaymentMode> paymentModes;
  final int distance;
  final List<OpeningHours> openingHoursNext7;
  final String currency;
  final Place place;
  final int position;

  @override
  String getId() {
    return id;
  }

  const GeoUnit._internal(
      {@required this.id,
      @required this.groupId,
      @required this.chainId,
      this.name,
      this.address,
      this.style,
      this.paymentModes,
      this.distance,
      this.openingHoursNext7,
      this.currency,
      this.place,
      this.position});

  factory GeoUnit(
      {String id,
      @required String groupId,
      @required String chainId,
      String name,
      Address address,
      ChainStyle style,
      List<PaymentMode> paymentModes,
      int distance,
      List<OpeningHours> openingHoursNext7,
      String currency,
      Place place,
      int position}) {
    return GeoUnit._internal(
      id: id == null ? UUID.getUUID() : id,
      groupId: groupId,
      chainId: chainId,
      name: name,
      address: address,
      style: style,
      paymentModes:
          paymentModes != null ? List.unmodifiable(paymentModes) : paymentModes,
      distance: distance,
      openingHoursNext7: openingHoursNext7,
      currency: currency,
      place: place,
      position: position,
    );
  }

  String getTodaysOpening() {
    DateTime today = DateTime.now();
    for (OpeningHours openingHours in openingHoursNext7) {
      if (openingHours.getDate().day == today.day && !openingHours.closed) {
        return openingHours.getRangeString();
      }
    }
    return null;
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is GeoUnit &&
        id == other.id &&
        groupId == other.groupId &&
        chainId == other.chainId &&
        name == other.name &&
        address == other.address &&
        style == other.style &&
        DeepCollectionEquality().equals(paymentModes, other.paymentModes) &&
        distance == other.distance &&
        DeepCollectionEquality()
            .equals(openingHoursNext7, other.openingHoursNext7) &&
        currency == other.currency &&
        place == other.place &&
        position == other.position;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = StringBuffer();

    buffer.write("GeoUnit {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("groupId=" + "$groupId" + ", ");
    buffer.write("chainId=" + "$chainId" + ", ");
    buffer.write("name=" + "$name" + ", ");
    buffer.write(
        "address=" + (address != null ? address.toString() : "null") + ", ");
    buffer.write("style=" + (style != null ? style.toString() : "null") + ", ");
    buffer.write(
        "distance=" + (distance != null ? distance.toString() : "null") + ", ");
    buffer
        .write("openingHoursNext7=" + "${openingHoursNext7.toString()}" + ", ");
    buffer.write("currency=" + "$currency" + ", ");
    buffer.write("place=" + (place != null ? place.toString() : "null"));
    buffer
        .write("position=" + (position != null ? position.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  GeoUnit copyWith(
      {String id,
      String groupId,
      String chainId,
      String name,
      Address address,
      ChainStyle style,
      List<PaymentMode> paymentModes,
      int distance,
      OpeningHours openingHoursNext7,
      String currency,
      Place place,
      int position}) {
    return GeoUnit(
      id: id ?? this.id,
      groupId: groupId ?? this.groupId,
      chainId: chainId ?? this.chainId,
      name: name ?? this.name,
      address: address ?? this.address,
      style: style ?? this.style,
      paymentModes: paymentModes ?? this.paymentModes,
      distance: distance ?? this.distance,
      openingHoursNext7: openingHoursNext7 ?? this.openingHoursNext7,
      currency: currency ?? this.currency,
      place: place ?? this.place,
      position: position ?? this.position,
    );
  }

  GeoUnit.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        groupId = json['groupId'],
        chainId = json['chainId'],
        name = json['name'],
        address = json['address'] != null
            ? Address.fromJson(Map<String, dynamic>.from(json['address']))
            : null,
        style = json['style'] != null
            ? ChainStyle.fromJson(Map<String, dynamic>.from(json['style']))
            : null,
        paymentModes = json['paymentModes'] is List
            ? (json['paymentModes'] as List)
                .map((e) => PaymentMode.fromJson(Map<String, dynamic>.from(e)))
                .toList()
            : null,
        distance = json['distance'],
        openingHoursNext7 = json['openingHoursNext7'] is List
            ? (json['openingHoursNext7'] as List)
                .map((e) => OpeningHours.fromMap(Map<String, dynamic>.from(e)))
                .toList()
            : null,
        currency = json['currency'],
        place = json['place'] != null
            ? Place.fromJson(Map<String, dynamic>.from(json['place']))
            : null,
        position = json['position'] ?? 0;

  Map<String, dynamic> toJson() => {
        'id': id,
        'groupId': groupId,
        'chainId': chainId,
        'name': name,
        'address': address?.toJson(),
        'style': style?.toJson(),
        'paymentModes': paymentModes?.map((e) => e?.toJson())?.toList(),
        'distance': distance,
        'openingHoursNext7': openingHoursNext7,
        'currency': currency,
        'place': place?.toJson(),
        'position': position
      };
}
