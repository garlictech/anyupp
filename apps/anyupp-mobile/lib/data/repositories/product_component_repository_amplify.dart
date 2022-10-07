import 'package:anyupp/domain/repositories/repositories.dart';
import 'package:anyupp/models/ProductComponent.dart';
import '/core/core.dart';
import '/graphql/generated/crud-api.dart';
import '/graphql/graphql.dart';

class ProductComponentRepositoryAmplify implements ProductComponentRepository {
  // Get all paginated data!
  @override
  getProductComponents(String ownerProductId) async {
    return _getProductComponents(ownerProductId)
        .reduce((previous, current) => previous + current);
  }

  Stream<List<ProductComponent>> _getProductComponents(
      String ownerProductId) async* {
    String? nextToken;

    do {
      final result = await GQL.amplify.execute(ListProductComponentsQuery(
        variables: ListProductComponentsArguments(
            ownerEntity: ownerProductId, nextToken: nextToken),
      ));

      if (result.hasErrors) {
        log.d(
            '***** ProductRepositoryAmplify._getProductComponents error=${result.errors}');
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
      }

      nextToken = result.data?.searchProductComponents?.nextToken;

      yield result.data?.searchProductComponents?.items
              .where((item) => item != null)
              .map((item) => ProductComponent.fromJson(item!.toJson()))
              .toList() ??
          const [];
    } while (nextToken != null);
  }
}
