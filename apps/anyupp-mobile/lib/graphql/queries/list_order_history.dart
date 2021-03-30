const QUERY_LIST_ORDER_HISTORY = '''
query ListOrderHistoryQuery(\$userId: ID!, \$unitId: ID!) {
  listOrders(filter: {
    userId: {eq: \$userId},
    unitId: {eq: \$unitId},
    or: [
      { status: { eq: PAID }},
      { status: { eq: REJECTED }},
    ]
  }) {      
    items {
      id
      paymentMethod {
        caption
        name
        method
      }
      paymentIntention
      place {
        seat
        table
      }
      staffId
      statusLog {
        status
        ts
        userId
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      takeAway
      unitId
      userId
      items {
        productId
        productName {
          de
          en
          hu
        }
        priceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
        quantity
        statusLog {
          status
          ts
          userId
        }
        takeAway
        variantId
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
