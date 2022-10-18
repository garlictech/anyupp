import 'package:geolocator/geolocator.dart';

abstract class GeoLocationRepository {
  Future<Position> getCurrentLocation();
}
