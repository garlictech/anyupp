const QUERY_LIST_TRANSACTIONS = '''
query ListTransactionsQuery(\$userId: ID!) {
  listTransactions (filter: {
    userId: {eq: \$userId}
  }){
    items {
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
  }
}
''';
