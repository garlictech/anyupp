import { validateSchema } from '../../lib/validator/validate';
import { groupSchema } from '../interfaces';

export const { validate: validateGetGroupCurrency } = validateSchema<{
  currency: string;
}>({ currency: groupSchema.currency }, 'GetGroupCurrency');
