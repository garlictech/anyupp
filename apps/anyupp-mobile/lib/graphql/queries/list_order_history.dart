const QUERY_LIST_ORDER_HISTORY = '''
query ListOrderHistoryQuery(\$userId: ID!, \$unitId: ID!) {
  listOrderHistorys(filter: {
    userId: {eq: \$userId},
    unitId: {eq: \$unitId}
  }) {
    items {
      id
      orderNum
      createdAt
      paymentMode {
        caption
        type
        method
      }
      paymentIntention
      place {
        seat
        table
      }
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
        variantId
        variantName {
          de
          en
          hu
        }
        allergens
        configSets {
          productSetId
          type
          name {
            de
            en
            hu
          }
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
        }
        image
      }
      transactionId
    }
  }
}
''';
