const QUERY_GET_CART = '''
query GetCurrentCartQuery(\$userId: ID!, \$unitId: ID!) {
listCarts(filter: {unitId: {eq: \$unitId}, userId: {eq: \$userId}}) {
    items {
      id
      items {
        priceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
        configSets {
          items {
            allergens
            name {
              de
              en
              hu
            }
            price
            productComponentId
          }
          name {
            de
            en
            hu
          }
          productSetId
          type
        }
        productId
        productName {
          de
          en
          hu
        }
        quantity
        statusLog {
          status
          ts
          userId
        }
        variantId
        variantName {
          de
          en
          hu
        }
        created
        allergens
      }
      paymentMode {
        caption
        method
        type
      }
      place {
        seat
        table
      }
      takeAway
      unitId
      userId
    }
  }
}
''';
