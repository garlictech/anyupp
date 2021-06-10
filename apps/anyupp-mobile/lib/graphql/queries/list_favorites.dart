const QUERY_LIST_FAVORITES = '''
query ListFavoriteProductsQuery(\$userId: ID!, \$unitId: ID!) {
  listFavoriteProducts(filter: {userId: {eq: \$userId}, unitId: {eq: \$unitId}}) {
    items {
      id
      unitId
      userId
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
        allergens
        unitId
        productCategoryId
        configSets {
          type
          productSetId
          position
          name {
            de
            en
            hu
          }
          maxSelection
          items {
            allergens
            name {
              de
              en
              hu
            }
            position
            price
            productComponentId
          }
        }
        variants {
          id
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
