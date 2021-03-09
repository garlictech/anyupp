const QUERY_LIST_FAVORITES = '''
query ListFavoriteProductsQuery(\$userId: ID!, \$unitId: ID!) {
  listFavoriteProducts(filter: {userID: {eq: \$userId}, unitID: {eq: \$unitId}}) {
    items {
      id
      unitID
      userID
      product {
        id
        image
        description {
          de
          en
          hu
        }
        name {
          de
          en
          hu
        }
        position
        productType
        tax
        unitId
        productCategoryId
        variants {
          pack {
            size
            unit
          }
          position
          price
          variantName {
            de
            en
            hu
          }
        }
      }
    }
  }
}
''';
