import { validateSchema } from '../../lib/validator/validate';
import { groupSchema } from '../interfaces';

export const { validate: validateGetGroupCurrency } = validateSchema<string>(
  { currency: groupSchema.currency, __typename: groupSchema.__typename },
  'GetGroupCurrency',
);
