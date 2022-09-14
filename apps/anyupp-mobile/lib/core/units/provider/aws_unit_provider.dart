import '/core/core.dart';
import '/graphql/generated/crud-api.graphql.dart';
import '/graphql/graphql.dart';
import '/models.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:collection/collection.dart';

class AwsUnitProvider implements IUnitProvider {
  @override
  Future<List<Unit>> searchUnitsNearRadius(LatLng location, int radius) async {
    log.d(
        'AwsUnitProvider.searchUnitsNearRadius()=location:$location, radius:$radius');
    var unit_id_list = await _searchByRadius(location, radius);
    var units =
        await Future.wait<Unit?>(unit_id_list.map((id) => _getUnit(id)));
    units.removeWhere((unit) => unit == null);
    var finalUnits = units.map((u) => u!).toList();

    log.d('AwsUnitProvider.searchUnitsNearRadius().units=$finalUnits');
    return finalUnits;
  }

  Future<List<String>> _searchByRadius(LatLng location, int radius,
      [int limit = 100, String? nextToken]) async {
    log.d('AwsUnitProvider._searchByRadius().location=$location');
    var result = await GQL.amplify.execute(
      SearchByRadiusQuery(
        variables: SearchByRadiusArguments(
          lat: location.latitude,
          lon: location.longitude,
          radiusInMeters: radius.toDouble(),
          limit: limit,
          nextToken: nextToken,
        ),
      ),
    );

    var unit_id_list =
        result.data?.searchByRadius?.items?.whereNotNull().toList() ?? [];
    log.d('AwsUnitProvider._searchByRadius().unit_id_list=$unit_id_list');

    return unit_id_list;
  }

  Future<Unit?> _getUnit(String unitId) async {
    var result = await GQL.amplify.execute(
      GetUnitByIdQuery(
        variables: GetUnitByIdArguments(
          unitId: unitId,
        ),
      ),
    );

    if (result.hasErrors) {
      log.d('AwsUnitProvider._getUnit().result.errors=${result.errors}');
      throw GraphQLException.fromGraphQLError(
          GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
    }
    final jsonFormat = result.data?.getUnit?.toJson();
    return jsonFormat != null ? Unit.fromJson(jsonFormat) : null;
  }
}
