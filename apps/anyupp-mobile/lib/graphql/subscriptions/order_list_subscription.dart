const SUBSCRIPTION_ORDER_LIST = '''
subscription OnOrderChangedSubscription(\$userId: String, \$unitId: String) {
  onOrderChanged(unitId: \$unitId, userId: \$userId) {
   	id
    unitId
    userId
    status
    paymentIntention
    staffId
    takeAway
    paymentMethod {
      caption
      name
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
''';
