const String QUERY_SEARCH_UNITS = '''
query SearchUnitsQuery {
  listGeoUnits {
    items {
      id
      groupId
      chainId
      name
      distance
      openingHours
      currency
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
      place {
        seat
        table
      }
      style {
        colors {
          backgroundDark
          backgroundLight
          borderDark
          borderLight
          disabled
          highlight
          indicator
          textDark
          textLight
        }
        images {
          header
          logo
        }
      }
    }
  }
}
''';
