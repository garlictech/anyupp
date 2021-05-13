const QUERY_LIST_TRANSACTIONS = '''
query ListTransactionsQuery() {
  listTransactions {
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
