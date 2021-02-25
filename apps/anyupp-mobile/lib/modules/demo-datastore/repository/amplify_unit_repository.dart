import 'package:amplify_datastore/amplify_datastore.dart';
import 'package:amplify_flutter/amplify.dart';
import 'package:fa_prev/models.dart';
import 'package:amplify_datastore_plugin_interface/amplify_datastore_plugin_interface.dart';

class AmplifyUnitRepository {
  Future<List<Unit>> listUnits() async {
    print('AmplifyUnitRepository.listUnits().startr()');
    try {
      List<Unit> units = await Amplify.DataStore.query(Unit.classType);
      print('AmplifyUnitRepository.listUnits().units=$units');
      return units;
    } on DataStoreException catch (e) {
      print('AmplifyUnitRepository.listUnits.error: $e');
      rethrow;
    } on Exception catch (e) {
      print('AmplifyUnitRepository.listUnits.error: $e');
      rethrow;
    }
  }

  Future<Unit> getUnitById(String unitId) async {
    print('AmplifyUnitRepository.getUnitById().start()=$unitId');
    try {
      List<Unit> units = await Amplify.DataStore.query(Unit.classType, where: Unit.ID.eq(unitId));
      print('AmplifyUnitRepository.getUnitById().unit=${units[0]}');
      return units[0];
    } on DataStoreException catch (e) {
      print('AmplifyUnitRepository.getUnitById.error: $e');
      rethrow;
    } on Exception catch (e) {
      print('AmplifyUnitRepository.getUnitById.error: $e');
      rethrow;
    }
  }

  Stream<SubscriptionEvent<Unit>> listenToUnits() {
    Stream<SubscriptionEvent<Unit>> stream = Amplify.DataStore.observe(Unit.classType);
    return stream;
    // stream.listen((event) {
    //   print('Received event of type ' + event.eventType.toString());
    //   print('Received post ' + event.item.toString());
    // });
  }
}
