import 'package:fa_prev/core/core.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:amplify_datastore/amplify_datastore.dart';
import 'package:amplify_flutter/amplify.dart';
import 'package:fa_prev/models.dart';
import 'package:amplify_datastore_plugin_interface/amplify_datastore_plugin_interface.dart';

class AwsUnitProvider implements IUnitProvider {


  Future<List<GeoUnit>> searchUnitsNearLocation(LatLng location, int radius) async {
    //  List<Unit> result = await _list<Unit>(Unit.classType);
    List<Unit> units = await Amplify.DataStore.query<Unit>(Unit.classType);
    print('***** AWS.searchUnitsNearLocation()=$units');
    if (units == null || units.isEmpty) {
      return [];
    }

    List<GeoUnit> results = [];
    for (int i = 0; i < units.length; i++) {
      Unit unit = units[i];
      Address address; 
      if (unit.address == null && unit.addressId != null) {
        address = (await Amplify.DataStore.query<Address>(Address.classType, where: Address.ID.eq(unit.addressId)))[0];
        print('***** AWS.searchUnitsNearLocation().address=$address');
      }
      GeoUnit geo = GeoUnit(
        name: unit.name,
        chainId: unit.chainId,
        groupId: unit.groupId,
        unitId: unit.id,
        paymentModes: unit.paymentModes == null ? null : unit.paymentModes.map((mode) => mode.method).toList(),
        distance: 100,
        address: address
      );

      results.add(geo);
    }
     return results;
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
