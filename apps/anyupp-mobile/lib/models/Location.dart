import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';

import 'core/model_base.dart';


@immutable
class Location extends Model {
  final String id;
  final double lat;
  final double lng;

  @override
  String getId() {
    return id;
  }

  const Location._internal({@required this.id, this.lat, this.lng});

  factory Location({String id, double lat, double lng}) {
    return Location._internal(
        id: id == null ? UUID.getUUID() : id, lat: lat, lng: lng);
  }

  bool equals(Object other) {
    return this == other;
  }

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Location &&
        id == other.id &&
        lat == other.lat &&
        lng == other.lng;
  }

  @override
  int get hashCode => toString().hashCode;

  @override
  String toString() {
    var buffer = new StringBuffer();

    buffer.write("Location {");
    buffer.write("id=" + "$id" + ", ");
    buffer.write("lat=" + (lat != null ? lat.toString() : "null") + ", ");
    buffer.write("lng=" + (lng != null ? lng.toString() : "null"));
    buffer.write("}");

    return buffer.toString();
  }

  Location copyWith({String id, double lat, double lng}) {
    return Location(
        id: id ?? this.id, lat: lat ?? this.lat, lng: lng ?? this.lng);
  }

  Location.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        lat = json['lat'],
        lng = json['lng'];

  Map<String, dynamic> toJson() => {'id': id, 'lat': lat, 'lng': lng};
}
