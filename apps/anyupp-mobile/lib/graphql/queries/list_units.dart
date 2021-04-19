const String QUERY_SEARCH_UNITS = '''
query GetUnitsNearLocationQuery(\$lat: Float!, \$lng: Float!) {
  getUnitsNearLocation(input: {
    location: {
      lat: \$lat,
      lng: \$lng
    }}) {
    items {
      address {
        address
        city
        country
        postalCode
        title
      }
      id
      distance
      currency
      chainId
      groupId
      name
      openingHours
      paymentModes {
        caption
        method
        name
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

// const String QUERY_SEARCH_UNITS = '''
// query SearchUnitsQuery {
//   listUnits {
//     items {
//       id
//       groupId
//       chainId
//       name
//       address {
//         address
//         city
//         country
//         postalCode
//         title
//         location {
//           lat
//           lng
//         }
//       }
//       email
//       isActive
//       isAcceptingOrders
//       phone
//     }
//   }
// }
// ''';
