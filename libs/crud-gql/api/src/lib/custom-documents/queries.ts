export const getGroupCurrency = /* GraphQL */ `
  query GetGroupCurrency($id: ID!) {
    getGroup(id: $id) {
      currency
    }
  }
`;
