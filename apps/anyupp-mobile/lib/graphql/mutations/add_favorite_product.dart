const MUTATION_ADD_FAVORITE_PRODUCT = '''
mutation CreateFavoriteProductMutation(\$userId: ID!, \$unitId: ID!, \$productId: ID!) {
  createFavoriteProduct(input: {
    userId: \$userId, 
    unitId: \$unitId, 
    favoriteProductProductId: \$productId
  }) {
    id
  }
}
''';
