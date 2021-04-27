const SUBSCRIPTION_ORDER_HISTORY_LIST = '''
subscription OnOrderHistoryChangedSubscription(\$userId: String, \$unitId: String) {
  onOrderChanged(unitId: \$unitId, userId: \$userId) {
   	id
    unitId
    userId
    paymentIntention
    takeAway
    paymentMode {
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
