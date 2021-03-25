import { validateSchema, groupSchema, IGroup } from '@bgap/shared/types';

export const getGroupCurrency = /* GraphQL */ `
  query GetGroupCurrency($id: ID!) {
    getGroup(id: $id) {
      currency
    }
  }
`;

export const { validate: validateGetGroupCurrency } = validateSchema<IGroup>(
  { currency: groupSchema.currency, __typename: groupSchema.__typename },
  'GetGroupCurrency',
);
