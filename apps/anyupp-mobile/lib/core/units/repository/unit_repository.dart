import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class UnitRepository {
  final CrudApi.UnitProvider _unitProvider;

  UnitRepository(this._unitProvider);

  Future<List<GeoUnit>> searchUnitsNearLocation(LatLng location, int radius) async {
    return _unitProvider.searchUnitsNearLocation(location, radius);
  }
}
