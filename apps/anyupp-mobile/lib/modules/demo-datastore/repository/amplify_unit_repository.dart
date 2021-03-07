// import 'package:amplify_datastore/amplify_datastore.dart';
import 'package:amplify_flutter/amplify.dart';
import 'package:fa_prev/models.dart';
import 'package:amplify_datastore_plugin_interface/amplify_datastore_plugin_interface.dart';

class AmplifyUnitRepository {

  // Future<Unit> getUnitById(String unitId) async {
  //   print('AmplifyUnitRepository.getUnitById().start()=$unitId');
  //   try {
  //     List<Unit> units = await Amplify.DataStore.query(Unit.classType, where: Unit.ID.eq(unitId));
  //     print('AmplifyUnitRepository.getUnitById().unit=${units[0]}');
  //     return units[0];
  //   } on DataStoreException catch (e) {
  //     print('AmplifyUnitRepository.getUnitById.DataStoreException: $e');
  //     rethrow;
  //   } on Exception catch (e) {
  //     print('AmplifyUnitRepository.getUnitById.Exception: $e');
  //     rethrow;
  //   }
  // }

  // Stream<SubscriptionEvent<Unit>> listenToUnits() {
  //   Stream<SubscriptionEvent<Unit>> stream = Amplify.DataStore.observe(Unit.classType);
  //   return stream;
  //   // stream.listen((event) {
  //   //   print('Received event of type ' + event.eventType.toString());
  //   //   print('Received post ' + event.item.toString());
  //   // });
  // }

  // Future<List<T>> listCommon<T extends Model>(ModelType<T> type) async {
  //   return _list<T>(type);
  // }

  // Future<List<Unit>> listUnits() async {
  //   return _list<Unit>(Unit.classType);
  // }

  // Future<List<ChainStyle>> listChainStyles() async {
  //   return _list<ChainStyle>(ChainStyle.classType);
  // }

  // Future<List<LocalizedItem>> listLocalizations() async {
  //   return _list<LocalizedItem>(LocalizedItem.classType);
  // }

  // Future<List<Group>> listGroups() async {
  //   return _list<Group>(Group.classType);
  // }

  // Future<List<T>> _list<T extends Model>(ModelType<T> type) async {
  //   print('AmplifyUnitRepository.list().start()=$T, ModelType=$type');
  //   try {
  //     List<T> res = await Amplify.DataStore.query<T>(type);
  //     print('AmplifyUnitRepository.list().result=$res');
  //     return res;
  //   } on DataStoreException catch (e) {
  //     print('AmplifyUnitRepository.list.DataStoreException: $e');
  //     rethrow;
  //   } on Exception catch (e) {
  //     print('AmplifyUnitRepository.list.Exception: $e');
  //     rethrow;
  //   }
  // }
}
