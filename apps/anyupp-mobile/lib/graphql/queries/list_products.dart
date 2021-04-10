const QUERY_LIST_PRODUCTS = '''
query ListProductsQuery(\$unitId: ID!, \$categoryId: ID!) {
  listGeneratedProducts(filter: {unitId: {eq: \$unitId}, productCategoryId: {eq: \$categoryId}}) {
    items {
      id
      unitId
      name {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      image
      position
      productCategoryId
      productType
      tax
      variants {
        id
        position
        price
        pack {
          size
          unit
        }
        variantName {
          de
          en
          hu
        }
      }
    }
  }
}
''';
