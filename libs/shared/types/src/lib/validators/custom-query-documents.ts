import { validateSchema } from '../../lib/validation/validate';
import { IGroup, groupSchema } from '../interfaces';

export const { validate: validateGetGroupCurrency } = validateSchema<IGroup>(
  { currency: groupSchema.currency, __typename: groupSchema.__typename },
  'GetGroupCurrency',
);
