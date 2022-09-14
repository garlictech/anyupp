import '../../domain/repositories/variant.dart';
import '/services/graphql/graphql.dart';
import '../../domain/entities/entities.dart';

class VariantRepositoryAppsync implements VariantRepository {
  final AmplifyApi _amplifyApi;

  VariantRepositoryAppsync(this._amplifyApi);

  @override
  setNewOwnerProduct(Product owner, Variant variant) async {
    String gqlDocumentGroupProd = ''' 
        mutation SetOwner {
          updateVariant(input: {id: "${variant.id}", ownerProduct: "${owner.id}"}) {
            id
          }
        }
    ''';

    final result = await _amplifyApi.execute(gqlDocumentGroupProd);
    return result["updateVariant"] != null;
  }
}
