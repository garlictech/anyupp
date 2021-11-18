import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class AwsUnitProvider implements IUnitProvider {
  @override
  Future<List<GeoUnit>> searchUnitsNearLocation(LatLng location, int radius) async {
    print('***** searchUnitsNearLocation().start(): lat=${location.latitude} lng:${location.longitude}');
    try {
      var result = await GQL.amplify.execute(GetUnitsNearLocationQuery(
        variables: GetUnitsNearLocationArguments(
          lat: location.latitude,
          lng: location.longitude,
        ),
      ));
      print('***** searchUnitsNearLocation().result=$result');
      print('***** searchUnitsNearLocation().result.data=${result.data}');
      print('***** searchUnitsNearLocation().result.errors=${result.errors}');

      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
      }

      if (result.data == null || result.data?.getUnitsNearLocation == null) {
        return [];
      }

      var items = result.data?.getUnitsNearLocation?.items;
      // print('***** searchUnitsNearLocation().items=$items, length=${items?.length}');
      List<GeoUnit> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          GeoUnit unit = GeoUnit.fromJson(items[i]!.toJson());
          // print('***** searchUnitsNearLocation().unit[$i]=${unit.name} ${unit.address}');
          results.add(unit);
        }
      }
      // results.sort((a, b) => a.position.compareTo(b.position));

      return results;
    } on Exception catch (e) {
      print('***** searchUnitsNearLocation().Exception: $e');
      return [];
    }
  }
}
