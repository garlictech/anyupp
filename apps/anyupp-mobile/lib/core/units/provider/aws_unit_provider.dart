import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class AwsUnitProvider implements IUnitProvider {
  @override
  Future<List<GeoUnit>> searchUnitsNearLocation(LatLng location, int radius) async {
    print('***** searchUnitsNearLocation().start(): lat=${location?.latitude} lng:${location.longitude}');
    try {
       QueryResult result = await GQL.backend.executeQuery(query: QUERY_SEARCH_UNITS, variables: {
        'lat': location.latitude,
        'lng': location.longitude,
      });

      if (result.data == null || result.data['getUnitsNearLocation'] == null) {
        return [];
      }

      List<dynamic> items = result.data['getUnitsNearLocation']['items'];
      // print('***** searchUnitsNearLocation().items=$items, length=${items?.length}');
      List<GeoUnit> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          GeoUnit unit = GeoUnit.fromJson(Map<String, dynamic>.from(items[i]));
          // print('***** searchUnitsNearLocation().unit[$i]=${unit.name} ${unit.address}');
          results.add(unit);
        }
      }
      results.sort((a, b) => a.position.compareTo(b.position));

      return results;
    } on Exception catch (e) {
      print('AwsUnitProvider.searchUnitsNearLocation.Exception: $e');
      return [];
      // TODO rethrow vagy nem?
      // rethrow;
    }
  }
}
