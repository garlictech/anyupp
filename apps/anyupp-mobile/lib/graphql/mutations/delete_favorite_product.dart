const MUTATION_DELETE_FAVORITE_PRODUCT = '''
mutation DeleteFavoriteProductMutation(\$favoriteProductId: ID!) {
  deleteFavoriteProduct(input: {id: \$favoriteProductId}) {
    id
  }
}
''';
