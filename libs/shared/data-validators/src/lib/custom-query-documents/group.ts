import { validateSchema } from '../../lib/validator/validate';
import { groupSchema } from '../interfaces';
import { IGroup } from '@bgap/shared/types';

export const { validate: validateGetGroupCurrency } = validateSchema<IGroup>(
  { currency: groupSchema.currency, __typename: groupSchema.__typename },
  'GetGroupCurrency',
);
