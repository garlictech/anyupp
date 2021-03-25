import { validateSchema, groupSchema, IGroup } from '@bgap/shared/types';

export const getGroupCurrency = /* GraphQL */ `
  query GetGroupCurrency($id: ID!) {
    getGroupCurrency(id: $id) {
      currency
    }
  }
`;

export const { validate: validateGetGroupCurrency } = validateSchema<IGroup>(
  { currency: groupSchema.currency },
  'GetGroupCurrency',
);
