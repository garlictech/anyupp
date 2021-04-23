import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:amazon_cognito_identity_dart_2/sig_v4.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/auth/auth.dart';
import 'package:flutter/foundation.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:http/http.dart' as http;

class AwsUnitProvider implements IUnitProvider {

  @override
  Future<List<GeoUnit>> searchUnitsNearLocation3(LatLng location, int radius) async {
    print('***** searchUnitsNearLocation().start(): lat=${location?.latitude} lng:${location.longitude}');
    try {
      IAuthProvider authProvider = getIt<IAuthProvider>();

      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getSigv4GraphQLClient();
      QueryResult result = await _client.value.query(
        QueryOptions(
          document: gql(
            '''
            query MyQuery {
              listChains {
                items {
                  id
                }
              }
            }
            ''',
          ),
          // variables: {
          //   'lat': location.latitude,
          //   'lng': location.longitude,
          // },
        ),
      );
    } on Exception catch (e) {
      print('searchUnitsNearLocation().error=$e');
    }
    return [];
  }

  @override
  Future<List<GeoUnit>> searchUnitsNearLocationSig4v(LatLng location, int radius) async {
    print('***** searchUnitsNearLocation().start(): lat=${location?.latitude} lng:${location.longitude}');
    try {
      IAuthProvider _authProvider = getIt<IAuthProvider>();
      CognitoCredentials _credential = _authProvider.credentials;

      const endpoint = 'https://jv6hts66zzh27mwbts7v5bkd7i.appsync-api.eu-west-1.amazonaws.com';
      final awsSigV4Client = AwsSigV4Client(
        _credential.accessKeyId,
        _credential.secretAccessKey,
        endpoint,
        serviceName: 'appsync',
        sessionToken: _credential.sessionToken,
        region: 'eu-west-1',
      );
      final query = '''
      query MyQuery {
        getUnitsNearLocation(input: {
          location: {
            lat: ${location.latitude},
            lng: ${location.longitude}
          }}) {
          items {
            address {
              address
              city
              country
              postalCode
              title
            }
            id
          }
        }
      }
      ''';
      final signedRequest = SigV4Request(awsSigV4Client,
          method: 'POST',
          path: '/graphql',
          headers: Map<String, String>.from({
            'Content-Type': 'application/graphql; charset=utf-8',
          }),
          body: Map<String, dynamic>.from({
            'operationName': 'MyQuery',
            'query': query,
          }));
      print('searchUnitsNearLocation().signedRequest.url=${signedRequest.url}');
      print('searchUnitsNearLocation().signedRequest.headers=${signedRequest.headers}');
      print('searchUnitsNearLocation().signedRequest.body=${signedRequest.body}');
      http.Response response =
          await http.post(signedRequest.url, headers: signedRequest.headers, body: signedRequest.body);
      print('searchUnitsNearLocation().response.body=${response.body}');
    } on Exception catch (e) {
      print('searchUnitsNearLocation().error=$e');
    }
    return [];
  }

  @override
  Future<List<GeoUnit>> searchUnitsNearLocation(LatLng location, int radius) async {
    print('***** searchUnitsNearLocation().start(): lat=${location?.latitude} lng:${location.longitude}');
    try {
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getGraphQLClient();
      QueryResult result = await _client.value.query(QueryOptions(
        document: gql(QUERY_SEARCH_UNITS),
        variables: {
          'lat': location.latitude,
          'lng': location.longitude,
        }
      ));

      // print('***** searchUnitsNearLocation().result()=$result');
      if (result.hasException) {
        print('searchUnitsNearLocation.exception=${result.exception}');
        // TODO ?!
      }

      if (result.data == null) {
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
      rethrow;
    }
  }

  // Future<List<GeoUnit>> searchUnitsNearLocationOld(LatLng location, int radius) async {
  //   print('***** searchUnitsNearLocation().start()');
  //   try {
  //     ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getAmplifyClient();
  //     QueryResult result = await _client.value.query(QueryOptions(
  //       document: gql(QUERY_SEARCH_UNITS),
  //     ));

  //     print('***** searchUnitsNearLocation().result()=$result');
  //     // print('***** searchUnitsNearLocation().result().data=${result?.data}');

  //     if (result.data == null) {
  //       return [];
  //     }

  //     List<dynamic> items = result.data['listUnits']['items'];
  //     print('***** searchUnitsNearLocation().items=$items, length=${items?.length}');
  //     List<GeoUnit> results = [];
  //     if (items != null) {
  //       for (int i = 0; i < items.length; i++) {
  //         GeoUnit unit = GeoUnit.fromJson(Map<String, dynamic>.from(items[i]));
  //         print('***** searchUnitsNearLocation().unit[$i]=${unit.name} ${unit.openingHours} ${unit.address}');
  //         results.add(unit);
  //       }
  //     }
  //     results.sort((a, b) => a.position.compareTo(b.position));

  //     return results;
  //   } on Exception catch (e) {
  //     print('AwsUnitProvider.searchUnitsNearLocation.Exception: $e');
  //     rethrow;
  //   }
  // }
}
