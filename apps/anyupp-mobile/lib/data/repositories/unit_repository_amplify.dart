import 'package:anyupp/domain/repositories/unit_repository.dart';
import 'package:anyupp/models/Unit.dart';
import '/graphql/generated/crud-api.dart';
import '/graphql/graphql.dart';

class UnitRepositoryAmplify implements UnitRepository {
  @override
  getUnit(String id) async {
    final result = await GQL.amplify.execute(GetUnitByIdQuery(
      variables: GetUnitByIdArguments(unitId: id),
    ));

    if (result.hasErrors) {
      throw GraphQLException.fromGraphQLError(
          GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
    }

    if (result.data?.getUnit == null) {
      throw "Unit $id is not in the database";
    }

    return Unit.fromJson(
        result.data!.getUnit!.toJson());
  }
}
