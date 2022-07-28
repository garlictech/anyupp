import '../../domain/repositories/unit.dart';
import '/services/graphql/graphql.dart';
import '../../domain/entities/entities.dart';

class UnitRepositoryAppsync implements UnitRepository {
  final AmplifyApi _amplifyApi;

  UnitRepositoryAppsync(this._amplifyApi);

  @override
  Future<List<Unit>> getUnitList() async {
    String gqlDocument = ''' 
      query ListUnits {
        listUnits {
          items {
            name
            id
          }
          nextToken
        }
      }
    ''';

    final result = await _amplifyApi.execute(gqlDocument);
    var items = result['listUnits']['items']
        .map<Unit>((item) => Unit.fromJson(item))
        .toList();

    return items;
  }

  @override
  getUnit(String id) async {
    String gqlDocument = ''' 
      query GetUnit(\$id: ID!) {
        getUnit(id: \$id) {
          id
          name
        }
      }
    ''';

    final result =
        await _amplifyApi.execute(gqlDocument, variables: {"id": id});
    final item = result['getUnit'];
    return item != null ? Unit.fromJson(item) : null;
  }
}
