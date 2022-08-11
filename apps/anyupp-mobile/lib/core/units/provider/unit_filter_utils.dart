import '/graphql/generated/crud-api.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

int calculateDistance(LatLng location, double? unitLat, double? unitLng) {
  if (unitLat == null || unitLng == null) {
    return 0;
  }
  return Geolocator.distanceBetween(
    location.latitude,
    location.longitude,
    unitLat,
    unitLng,
  ).toInt().abs();
}

bool isUnitOpened(GetUnitById$Query$GetUnit unit, DateTime now) {
  return unit.isActive && unit.isAcceptingOrders;
}
