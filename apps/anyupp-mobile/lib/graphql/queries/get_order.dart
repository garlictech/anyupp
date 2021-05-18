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
      name
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
