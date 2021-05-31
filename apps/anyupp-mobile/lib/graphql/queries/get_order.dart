const QUERY_GET_ORDER = '''
query GetOrderQuery(\$orderId: ID!) {
  getOrder(id: \$orderId) {
    transactionId
    createdAt
    id
    orderNum
    paymentIntention
    paymentMode {
      caption
      method
      type
    }
    items {
      allergens
      created
      image
      laneId
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
    }
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
    takeAway
    unitId
    updatedAt
    userId
  }
}
''';
