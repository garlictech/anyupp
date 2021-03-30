const QUERY_LIST_PRODUCT_CATEGORIES = '''
query ListProductCategoriesQuery(\$unitId: ID!) {
  listProductCategorys(filter: {unitId: {eq: \$unitId }}) {
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
    }
  }
}
''';
