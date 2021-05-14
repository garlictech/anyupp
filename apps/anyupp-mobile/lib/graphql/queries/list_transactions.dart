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
      userId
      type
      total
      status
      orderId
      updatedAt
    }
  }
}
''';
