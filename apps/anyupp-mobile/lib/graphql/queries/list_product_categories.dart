const QUERY_LIST_PRODUCT_CATEGORIES = '''
query ListProductCategoriesQuery(\$chainId: ID!) {
  listProductCategorys(filter: {chainId: {eq: \$chainId }}) {
    items {
      id
      chainId
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
