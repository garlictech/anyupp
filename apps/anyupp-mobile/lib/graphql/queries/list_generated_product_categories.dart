const QUERY_LIST_GENERATED_PRODUCT_CATEGORIES = '''
query ListGeneratedProductCategoriesQuery(\$unitId: ID!) {
  listGeneratedProductCategorys(filter: {unitId: {eq: \$unitId }}) {
   items {
      updatedAt
      createdAt
      id
      productCategoryId
      productNum
      unitId
      productCategory {
        chainId
        createdAt
        description {
          de
          en
          hu
        }
        id
        image
        name {
          de
          en
          hu
        }
        position
        updatedAt
      }
    }
  }
}
''';