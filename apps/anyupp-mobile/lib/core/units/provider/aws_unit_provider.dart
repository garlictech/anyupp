import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:flutter/foundation.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class AwsUnitProvider implements IUnitProvider {
  @override
  Future<List<GeoUnit>> searchUnitsNearLocation(LatLng location, int radius) async {
    print('***** searchUnitsNearLocation().start()');
    try {
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getGraphQLClient();
      QueryResult result = await _client.value.query(QueryOptions(
        document: gql(QUERY_SEARCH_UNITS),
      ));

      print('***** searchUnitsNearLocation().result()=$result');
      // print('***** searchUnitsNearLocation().result().data=${result?.data}');

      if (result.data == null) {
        return [];
      }

      List<dynamic> items = result.data['listUnits']['items'];
      print('***** searchUnitsNearLocation().items=$items, length=${items?.length}');
      List<GeoUnit> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          GeoUnit unit = GeoUnit.fromJson(Map<String, dynamic>.from(items[i]));
          print('***** searchUnitsNearLocation().unit[$i]=${unit.name} ${unit.openingHours} ${unit.address}');
          results.add(unit);
        }
      }
      results.sort((a, b) => a.position.compareTo(b.position));

      return results;
    } on Exception catch (e) {
      print('AwsUnitProvider.searchUnitsNearLocation.Exception: $e');
      rethrow;
    }
  }

  // Future<List<GeoUnit>> searchUnitsNearLocation(LatLng location, int radius) async {
  //   //  List<Unit> result = await _list<Unit>(Unit.classType);
  //   List<Unit> units = await Amplify.DataStore.query<Unit>(Unit.classType);
  //   print('***** AWS.searchUnitsNearLocation()=$units');
  //   if (units == null || units.isEmpty) {
  //     return [];
  //   }

  //   List<GeoUnit> results = [];
  //   for (int i = 0; i < units.length; i++) {
  //     Unit unit = units[i];
  //     GeoUnit geo = await _loadUnitData(unit);
  //     print('***** AWS.searchUnitsNearLocation().geo=$geo');
  //     results.add(geo);
  //   }
  //   return results;
  // }

  // Future<GeoUnit> _loadUnitData(Unit unit) async {
  //   Address address;
  //   if (unit.address == null && unit.addressId != null) {
  //     address = await _loadById(Address.classType, Address.ID.eq(unit.addressId));
  //     print('***** AWS.searchUnitsNearLocation().address=$address');
  //   }

  //   ChainStyle unitStyle;
  //   Chain chain;
  //   if (unit.chain == null && unit.chainId != null) {
  //     chain = await _loadById(Chain.classType,Chain.ID.eq(unit.chainId));
  //     if (chain != null) {
  //       ChainStyle style = await _loadById(ChainStyle.classType, ChainStyle.ID.eq(chain.styleId));
  //       ChainStyleColors colors = await _loadById(ChainStyleColors.classType, ChainStyleColors.ID.eq(style.colorsId));
  //       ChainStyleImages images = await _loadById(ChainStyleImages.classType, ChainStyleImages.ID.eq(style.imagesId));

  //       unitStyle = ChainStyle(
  //         colors: colors,
  //         images: images
  //       );
  //     }
  //   }

  //   return GeoUnit(
  //       name: unit.name,
  //       chainId: unit.chainId,
  //       groupId: unit.groupId,
  //       unitId: unit.id,
  //       paymentModes: unit.paymentModes == null ? null : unit.paymentModes.map((mode) => mode.method).toList(),
  //       distance: 100,
  //       address: address,
  //       style: unitStyle,
  //       openingHours: unit.openingHours?.toString(),
  //       currency: "HUF" // TODO AWS!
  //       );
  // }

  // Future<List<Unit>> listUnits() async {
  //   return _list<Unit>(Unit.classType);
  // }

  // Future<T> _loadById<T extends Model>(ModelType<T> type, QueryPredicate where) async {
  //   T data = (await Amplify.DataStore.query<T>(type, where: where))[0];
  //   return data;
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
