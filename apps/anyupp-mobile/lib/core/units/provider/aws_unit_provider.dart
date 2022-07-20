import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/units/provider/unit_filter_utils.dart';
import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:collection/collection.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class AwsUnitProvider implements IUnitProvider {
  @override
  Future<List<GeoUnit>> searchUnitsNearRadius(
      LatLng location, int radius) async {
    log.d(
        'AwsUnitProvider.searchUnitsNearRadius()=location:$location, radius:$radius');
    var unit_id_list = await _searchByRadius(location, radius);
    var units = await Future.wait<GeoUnit?>(
        unit_id_list.map((id) => _getGeoUnit(id, location)));
    units.removeWhere((unit) => unit == null);
    var finalUnits = units.map((u) => u!).toList();

    log.d('AwsUnitProvider.searchUnitsNearRadius().units=$finalUnits');
    return finalUnits;
  }

  Future<GeoUnit?> _getGeoUnit(String unitId, LatLng location) async {
    log.d('AwsUnitProvider._getGeoUnit().unitId=$unitId');
    var unit = await _getUnit(unitId);
    if (unit == null) {
      log.e('AwsUnitProvider._getGeoUnit().unitNotFound=$unitId');
      throw GraphQLException.fromException(
        GraphQLException.CODE_QUERY_EXCEPTION,
        Exception('Unit not found: $unitId'),
      );
    }

    log.d(
        'AwsUnitProvider.isUnitOpened[${unit.id}]=${isUnitOpened(unit, DateTime.now())}');

    if (!isUnitOpened(unit, DateTime.now())) {
      return null;
    }

    log.d('AwsUnitProvider._getGeoUnit().unit=${unit.toJson()}');
    GetGroupById$Query$GetGroup? group;
    GetChainById$Query$GetChain? chain;
    await Future.wait(
      [
        (() async => chain = await _getChain(unit.chainId))(),
        (() async => group = await _getGroup(unit.groupId))(),
      ],
    );

    if (group == null) {
      throw GraphQLException.fromException(
        GraphQLException.CODE_QUERY_EXCEPTION,
        Exception('Group not found: ${unit.groupId}'),
      );
    }

    if (chain == null) {
      throw GraphQLException.fromException(
        GraphQLException.CODE_QUERY_EXCEPTION,
        Exception('Chain not found: ${unit.chainId}'),
      );
    }
    // log.d('AwsUnitProvider._getGeoUnit().group=${group?.toJson()}');
    // log.d('AwsUnitProvider._getGeoUnit().chain=${chain?.toJson()}');

    Map<String, dynamic> merged = unit.toJson();
    merged['currency'] = group!.toJson()['currency'];
    merged['style'] = chain!.style.toJson();
    var geoUnit = GeoUnit.fromJson(merged);
    // log.d('AwsUnitProvider._getGeoUnit().geoUnit=$geoUnit');
    return geoUnit.copyWith(
      distance: calculateDistance(
        location,
        unit.location?.lat,
        unit.location?.lon,
      ),
      openingHoursNext7: getOpeningHoursNext7(unit),
    );
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

    if (result.hasErrors) {
      // log.d('AwsUnitProvider._searchByRadius().result.errors=${result.errors}');
      // throw GraphQLException.fromGraphQLError(
      //     GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
      // TODO MOCK DEV:
      // return [
      //   'seeded_unit_c1_g1_1_id',
      //   'seeded_unit_c1_g1_2_id',
      //   'seeded_unit_c1_g2_1_id',
      //   'sportbar-rkeeper-unit',
      //   'unit-ii',
      //   'unit-it',
      //   'unit-pi',
      //   'unit-pt',
      //   'yellow-rkeeper-unit',
      // ]; // TODO MOCK!
      // TODO MOCK STAGING:
      return [
        '-MGMw7p0gQsX31ZLZOkK',
        '213bc500-b0e4-11ec-9a1a-135807c7de07',
        '42cda216-ded8-4b5a-8e63-6c7d6778534c',
        '556f8370-7def-11ec-a8cb-155be376300c',
        '9b1bb994-9de4-4d70-988f-dc67e2963565',
        'f94bfb40-0675-11ed-a1b8-d1473ba44d83',
        'fc97ed7f-80ab-49af-a74e-785fc478a337',
      ];
    }
    var unit_id_list =
        result.data?.searchByRadius?.items?.whereNotNull().toList() ?? [];
    log.d('AwsUnitProvider._searchByRadius().unit_id_list=$unit_id_list');

    return unit_id_list;
  }

  Future<GetUnitById$Query$GetUnit?> _getUnit(String unitId) async {
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

    return result.data?.getUnit;
  }

  Future<GetGroupById$Query$GetGroup?> _getGroup(String groupId) async {
    var result = await GQL.amplify.execute(
      GetGroupByIdQuery(
        variables: GetGroupByIdArguments(
          groupId: groupId,
        ),
      ),
      fetchPolicy: FetchPolicy.cacheFirst,
    );

    if (result.hasErrors) {
      log.d('AwsUnitProvider._getGroup().result.errors=${result.errors}');
      throw GraphQLException.fromGraphQLError(
          GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
    }

    return result.data?.getGroup;
  }

  Future<GetChainById$Query$GetChain?> _getChain(String chainId) async {
    var result = await GQL.amplify.execute(
      GetChainByIdQuery(
        variables: GetChainByIdArguments(
          chainId: chainId,
        ),
      ),
      fetchPolicy: FetchPolicy.cacheFirst,
    );

    if (result.hasErrors) {
      log.d('AwsUnitProvider._getChain().result.errors=${result.errors}');
      throw GraphQLException.fromGraphQLError(
          GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
    }

    return result.data?.getChain;
  }
}
