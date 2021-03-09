const MUTATION_ADD_FAVORITE_PRODUCT = '''
mutation CreateFavoriteProductMutation(\$userId: ID!, \$unitId: ID!, \$productId: ID!) {
  createFavoriteProduct(input: {
    userID: \$userId, 
    unitID: \$unitId, 
    favoriteProductProductId: \$productId
  }) {
    id
  }
}
''';
