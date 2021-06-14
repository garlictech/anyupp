const QUERY_LIST_ORDER_HISTORY = '''
query ListOrderHistoryQuery(\$userId: ID!, \$unitId: ID!) {
  listOrders(filter: {
    userId: {eq: \$userId},
    unitId: {eq: \$unitId},
    archived: {eq: true}
  }) {
    items {
      id
      orderNum
      createdAt
      archived
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
