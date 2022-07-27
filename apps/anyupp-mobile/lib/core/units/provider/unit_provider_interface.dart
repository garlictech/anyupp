import '/models.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

abstract class IUnitProvider {
  Future<List<GeoUnit>> searchUnitsNearRadius(LatLng location, int radius);
}
