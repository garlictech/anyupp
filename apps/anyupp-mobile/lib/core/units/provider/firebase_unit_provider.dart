import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/providers/function_provider_interface.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class FirebaseUnitProvider implements IUnitProvider {
  final IFunctionProvider _functionProvider;

  FirebaseUnitProvider(this._functionProvider);

  Future<List<GeoUnit>> searchUnitsNearLocation(LatLng location, int radius) async {
     List<dynamic> result = await this._getUnitsNearLocation<List<dynamic>>({
      'lat': location.latitude,
      'lng': location.longitude,
      // 'radius': radius, // Load all the units without a defined radius
    });
    return result == null ? null : result.map((value) {
      return GeoUnit.fromMap(Map<String, dynamic>.from(value));
    }).toList();
  }

  Future<T> _getUnitsNearLocation<T>(Map params) async {
    return _functionProvider.call<T>('unitsNearLocation', params);
  }
}
