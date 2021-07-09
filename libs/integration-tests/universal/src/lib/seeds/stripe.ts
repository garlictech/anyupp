import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { of } from 'rxjs';
import { resultTap } from './seed.util';

export const createTestPaymentMethod = (
  input: AnyuppApi.StripeCardCreateInput,
  anyuppSdk: AnyuppApi.AnyuppSdk,
) =>
  anyuppSdk
    .CreateStripeCard({ input })
    .pipe(resultTap('StripePaymentMethod create', input.card_number));

export const updateTestPaymentMethod = (
  input: AnyuppApi.StripeCardUpdateInput,
  anyuppSdk: AnyuppApi.AnyuppSdk,
) =>
  anyuppSdk
    .UpdateMyStripeCard({ input })
    .pipe(resultTap('StripePaymentMethod update', input.paymentMethodId));

export const deleteTestPaymentMethod = (
  id: string,
  anyuppSdk: AnyuppApi.AnyuppSdk,
) =>
  anyuppSdk
    .DeleteMyStripeCard({ input: { paymentMethodId: id } })
    .pipe(resultTap('StripePaymentMethod deleted', id));
