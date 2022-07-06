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
  Future<List<GeoUnit>> searchUnitsNearLocation(
      LatLng location, int radius) async {
    log.d(
        '***** searchUnitsNearLocation().start(): lat=${location.latitude} lng:${location.longitude}');
    try {
      var result = await GQL.amplify.execute(
        GetUnitsNearLocationQuery(
          variables: GetUnitsNearLocationArguments(
            lat: location.latitude,
            lng: location.longitude,
          ),
        ),
      );
      print('***** searchUnitsNearLocation().result.$result');

      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
      }

      if (result.data == null || result.data?.getUnitsNearLocation == null) {
        log.w('***** searchUnitsNearLocation():No units found.');
        return [];
      }

      var items = result.data?.getUnitsNearLocation?.items;
      log.d('***** searchUnitsNearLocation().items.length=${items?.length}');
      List<GeoUnit> results = [];
      if (items != null) {
        for (int i = 0; i < items.length; i++) {
          results.add(GeoUnit.fromJson(items[i]!.toJson()));
        }
      }

      return results;
    } on Exception catch (e) {
      log.e('***** searchUnitsNearLocation().Exception: $e');
      rethrow;
    }
  }

  @override
  Future<List<GeoUnit>> searchUnitsNearRadius(
      LatLng location, int radius) async {
    print(
        'AwsUnitProvider.searchUnitsNearRadius()=location:$location, radius:$radius');
    var unit_id_list = await _searchByRadius(location, radius);
    var units = await Future.wait<GeoUnit?>(
        unit_id_list.map((id) => _getGeoUnit(id, location)));
    units.removeWhere((unit) => unit == null);
    var finalUnits = units.map((u) => u!).toList();

    print('AwsUnitProvider.searchUnitsNearRadius().units=$finalUnits');
    return finalUnits;
  }

  Future<GeoUnit?> _getGeoUnit(String unitId, LatLng location) async {
    print('AwsUnitProvider._getGeoUnit().unitId=$unitId');
    var unit = await _getUnit(unitId);
    if (unit == null) {
      throw GraphQLException.fromException(
        GraphQLException.CODE_QUERY_EXCEPTION,
        Exception('Unit not found: $unitId'),
      );
    }

    print(
        'AwsUnitProvider.isUnitOpened[${unit.id}]=${isUnitOpened(unit, DateTime.now())}');

    if (!isUnitOpened(unit, DateTime.now())) {
      return null;
    }

    print('AwsUnitProvider._getGeoUnit().unit=${unit.toJson()}');
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
    // print('AwsUnitProvider._getGeoUnit().group=${group?.toJson()}');
    // print('AwsUnitProvider._getGeoUnit().chain=${chain?.toJson()}');

    Map<String, dynamic> merged = unit.toJson();
    merged['currency'] = group!.toJson()['currency'];
    merged['style'] = chain!.style.toJson();
    var geoUnit = GeoUnit.fromJson(merged);
    print('AwsUnitProvider._getGeoUnit().geoUnit=$geoUnit');
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
    print('AwsUnitProvider._searchByRadius().location=$location');
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

    // TODO MOCK!
    // if (result.hasErrors) {
    //   print('AwsUnitProvider._searchByRadius().result.errors=${result.errors}');
    //   throw GraphQLException.fromGraphQLError(
    //       GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
    // }
    var unit_id_list =
        result.data?.searchByRadius?.items?.whereNotNull().toList() ?? [];
    unit_id_list = [
      'seeded_unit_c1_g1_1_id',
      'seeded_unit_c1_g1_2_id',
      'seeded_unit_c1_g2_1_id',
      'sportbar-rkeeper-unit',
      'unit-ii',
      'unit-it',
      'unit-pi',
      'unit-pt',
      'yellow-rkeeper-unit',
    ]; // TODO MOCK!
    print('AwsUnitProvider._searchByRadius().unit_id_list=$unit_id_list');

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
      print('AwsUnitProvider._getUnit().result.errors=${result.errors}');
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
      print('AwsUnitProvider._getGroup().result.errors=${result.errors}');
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
      print('AwsUnitProvider._getChain().result.errors=${result.errors}');
      throw GraphQLException.fromGraphQLError(
          GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
    }

    return result.data?.getChain;
  }
}
