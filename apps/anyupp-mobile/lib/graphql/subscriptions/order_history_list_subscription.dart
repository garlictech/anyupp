const SUBSCRIPTION_ORDER_HISTORY_LIST = '''
subscription OnOrderHistoryChangedSubscription(\$userId: String, \$unitId: String) {
  onOrderChanged(unitId: \$unitId, userId: \$userId) {
    id
    orderNum
    unitId
    userId
    archived
    paymentIntention
    takeAway
    paymentMode {
      caption
      type
      method
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
      image
      laneId
      created
    }
    transactionId
    transactionStatus
    updatedAt
    createdAt
  }
}
''';
