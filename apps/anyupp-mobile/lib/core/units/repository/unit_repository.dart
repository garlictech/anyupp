import '/core/core.dart';
import '/models.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class UnitRepository {
  final IUnitProvider _unitProvider;

  UnitRepository(this._unitProvider);

  Future<List<GeoUnit>> searchUnitsNearRadius(
      LatLng location, int radius) async {
    return _unitProvider.searchUnitsNearRadius(location, radius);
  }
}
