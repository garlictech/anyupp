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
        location {
          lat
          lng
        }
      }
      id
      distance
      currency
      chainId
      groupId
      name
      paymentModes {
        caption
        method
        type
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
