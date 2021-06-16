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
    archived
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
    transaction {
      createdAt
      currency
      externalTransactionId
      id
      invoice {
        city
        country
        createdAt
        customerName
        email
        externalInvoiceId
        id
        orderId
        pdfUrl
        postalCode
        status
        streetAddress
        taxNumber
        transactionId
        userId
        updatedAt
      }
      invoiceId
      orderId
      receipt {
        createdAt
        email
        externalReceiptId
        id
        orderId
        pdfData
        status
        transactionId
        updatedAt
        userId
      }
      receiptId
      status
      total
      type
      updatedAt
      user {
        createdAt
        email
        id
        invoiceAddress {
          city
          country
          customerName
          email
          postalCode
          streetAddress
          taxNumber
        }
        name
        phone
        profileImage
        stripeCustomerId
        updatedAt
      }
      userId
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
