export const getGroupCurrency = /* GraphQL */ `
  query GetGroupCurrency($id: ID!) {
    getGroupCurrency(id: $id) {
      currency
    }
  }
`;
