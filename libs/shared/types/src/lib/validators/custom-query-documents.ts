import { groupSchema, IGroup, validateSchema } from '@bgap/shared/types';

export const { validate: validateGetGroupCurrency } = validateSchema<IGroup>(
  { currency: groupSchema.currency, __typename: groupSchema.__typename },
  'GetGroupCurrency',
);
