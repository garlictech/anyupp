const String QUERY_SEARCH_UNITS = '''
query SearchUnitsQuery {
  listUnits {
    items {
      id
      groupId
      chainId
      name
      address {
        address
        city
        country
        postalCode
        title
        location {
          lat
          lng
        }
      }
      email
      isActive
      isAcceptingOrders
      phone
    }
  }
}
''';
