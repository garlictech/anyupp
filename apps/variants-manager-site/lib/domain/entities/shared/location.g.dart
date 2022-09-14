// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'location.dart';

// **************************************************************************
// FunctionalDataGenerator
// **************************************************************************

abstract class $Location {
  const $Location();

  double get lat;
  double get lon;

  Location copyWith({
    double? lat,
    double? lon,
  }) =>
      Location(
        lat: lat ?? this.lat,
        lon: lon ?? this.lon,
      );

  Location copyUsing(void Function(Location$Change change) mutator) {
    final change = Location$Change._(
      this.lat,
      this.lon,
    );
    mutator(change);
    return Location(
      lat: change.lat,
      lon: change.lon,
    );
  }

  @override
  String toString() => "Location(lat: $lat, lon: $lon)";

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  bool operator ==(Object other) =>
      other is Location &&
      other.runtimeType == runtimeType &&
      lat == other.lat &&
      lon == other.lon;

  @override
  // ignore: avoid_equals_and_hash_code_on_mutable_classes
  int get hashCode {
    var result = 17;
    result = 37 * result + lat.hashCode;
    result = 37 * result + lon.hashCode;
    return result;
  }
}

class Location$Change {
  Location$Change._(
    this.lat,
    this.lon,
  );

  double lat;
  double lon;
}

// ignore: avoid_classes_with_only_static_members
class Location$ {
  static final lat = Lens<Location, double>(
    (latContainer) => latContainer.lat,
    (latContainer, lat) => latContainer.copyWith(lat: lat),
  );

  static final lon = Lens<Location, double>(
    (lonContainer) => lonContainer.lon,
    (lonContainer, lon) => lonContainer.copyWith(lon: lon),
  );
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Location _$LocationFromJson(Map<String, dynamic> json) => Location(
      lat: (json['lat'] as num).toDouble(),
      lon: (json['lon'] as num).toDouble(),
    );

Map<String, dynamic> _$LocationToJson(Location instance) => <String, dynamic>{
      'lat': instance.lat,
      'lon': instance.lon,
    };
