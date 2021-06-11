const SUBSCRIPTION_ORDER_LIST = '''
subscription OnOrderChangedSubscription(\$userId: String, \$unitId: String) {
  onOrderChanged(unitId: \$unitId, userId: \$userId, archived: false) {
   	id
    orderNum
    unitId
    userId
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
    }
  }
}
''';
