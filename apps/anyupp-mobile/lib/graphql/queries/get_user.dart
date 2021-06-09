const QUERY_GET_USER_BY_ID = '''
query GetUserQuery(\$userId: ID!) {
  getUser(id: \$userId) {
    createdAt
    email
    id
    name
    phone
    profileImage
    stripeCustomerId
    updatedAt
    invoiceAddress {
      city
      country
      customerName
      email
      postalCode
      streetAddress
      taxNumber
    }
  }
}
''';
