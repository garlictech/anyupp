import '/core/core.dart';
import 'package:flutter/foundation.dart';

@immutable
class Location {
  final String? id;
  final double lat;
  final double lng;

  Location({
    this.id,
    required this.lat,
    required this.lng,
  });

  Location copyWith({
    String? id,
    double? lat,
    double? lng,
  }) {
    return Location(
      id: id ?? this.id,
      lat: lat ?? this.lat,
      lng: lng ?? this.lng,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'lat': lat,
      'lng': lng,
    };
  }

  factory Location.fromJson(Map<String, dynamic> map) {
    log.e('Location.fromJson=$map');
    return Location(
      id: map['id'],
      lat: map['lat'],
      lng: map['lng'] ?? map['lon'],
    );
  }

  @override
  String toString() => 'Location(id: $id, lat: $lat, lng: $lng)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Location &&
        other.id == id &&
        other.lat == lat &&
        other.lng == lng;
  }

  @override
  int get hashCode => id.hashCode ^ lat.hashCode ^ lng.hashCode;
}
