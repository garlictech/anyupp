import 'package:fa_prev/core/core.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:amplify_datastore/amplify_datastore.dart';
import 'package:amplify_flutter/amplify.dart';
import 'package:fa_prev/models.dart';
import 'package:amplify_datastore_plugin_interface/amplify_datastore_plugin_interface.dart';

class AwsUnitProvider implements IUnitProvider {


  Future<List<GeoUnit>> searchUnitsNearLocation(LatLng location, int radius) async {
     List<Unit> result = await _list<Unit>(Unit.classType);
     
    return result == null ? null : result.map((unit) {
      return GeoUnit(
        name: unit.name,
        chainId: unit.chainId,
        groupId: unit.groupId,
        unitId: unit.id,
        paymentModes: unit.paymentModes == null ? null : unit.paymentModes.map((mode) => mode.method).toList(),
        distance: 100,
        address: unit.group?.address != null ? Address(
          address: unit.group.address.address,
          city: unit.group.address.city,
          country: unit.group.address.country,
          id: unit.group.address.id,
          location: unit.group.address.location != null ? Location(
            id: unit.group.address.location.id,
            lat: unit.group.address.location.lat,
            lng: unit.group.address.location.lng,
          ) : null,
          postalCode: unit.group.address.postalCode,
          title: unit.group.address.title
        ) : null,
      );
    }).toList();
  }

  Future<List<Unit>> listUnits() async {
    return _list<Unit>(Unit.classType);
  }

  Future<List<T>> _list<T extends Model>(ModelType<T> type) async {
    print('AmplifyUnitRepository.list().start()=$T, ModelType=$type');
    try {
      List<T> res = await Amplify.DataStore.query<T>(type);
      print('AmplifyUnitRepository.list().result=$res');
      return res;
    } on DataStoreException catch (e) {
      print('AmplifyUnitRepository.list.DataStoreException: $e');
      rethrow;
    } on Exception catch (e) {
      print('AmplifyUnitRepository.list.Exception: $e');
      rethrow;
    }
  }
}
