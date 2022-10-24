import 'package:anyupp/domain/repositories/repositories.dart';
import 'package:anyupp/models/ProductComponent.dart';
import 'package:anyupp/models/ProductComponentSet.dart';
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

  @override
  getProductComponentSet(String id) async {
    final result = await GQL.amplify.execute(GetProductComponentSetQuery(
      variables: GetProductComponentSetArguments(id: id),
    ));

    if (result.hasErrors) {
      log.d(
          '***** ProductRepositoryAmplify.getProductComponentSet error=${result.errors}');
      throw GraphQLException.fromGraphQLError(
          GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
    }

    if (result.data?.getProductComponentSet == null) {
      throw "ProductComponentSet $id is not in the database";
    }

    return ProductComponentSet.fromJson(
        result.data!.getProductComponentSet!.toJson());
  }
  
  @override
  getProductComponent(String id) async {
    final result = await GQL.amplify.execute(GetProductComponentQuery(
      variables: GetProductComponentArguments(id: id),
    ));

    if (result.hasErrors) {
      log.d(
          '***** ProductRepositoryAmplify.getProductComponent error=${result.errors}');
      throw GraphQLException.fromGraphQLError(
          GraphQLException.CODE_QUERY_EXCEPTION, result.errors);
    }

    if (result.data?.getProductComponent == null) {
      throw "ProductComponent $id is not in the database";
    }

    return ProductComponent.fromJson(
        result.data!.getProductComponent!.toJson());
  }
}
