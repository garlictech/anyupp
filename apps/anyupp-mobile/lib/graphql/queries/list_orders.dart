const QUERY_LIST_ACTIVE_ORDERS = '''
query ListOrdersQuery(\$userId: ID!, \$unitId: ID!) {
  listOrders(filter: {
    userId: {eq: \$userId},
    unitId: {eq: \$unitId},
    and: [
      { status: { ne: PAID }},
      { status: { ne: REJECTED }},
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
      status
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
