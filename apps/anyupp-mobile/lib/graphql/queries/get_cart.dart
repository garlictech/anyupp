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
      }
      paymentMode {
        caption
        method
        name
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
