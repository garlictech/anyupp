import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { loadUser } from '../stripe-graphql-crud';
import { StripeResolverDeps } from '../stripe.utils';

export const deleteStripeCard =
  (userId: string, input: AnyuppApi.StripeCardDeleteInput) =>
  async (deps: StripeResolverDeps): Promise<boolean> => {
    console.debug('**** deleteStripeCard().start()');

    const user = await loadUser(userId)(deps);
    console.debug('**** deleteStripeCard().user=' + user?.id);
    if (!user) {
      throw Error('User not found with id=' + userId);
    }
    console.debug(
      '**** deleteStripeCard().user.stripeCustomerId=' + user?.stripeCustomerId,
    );
    if (!user.stripeCustomerId) {
      throw Error(
        "Cannot delete card. User don't have a Stripe customerId. User=" +
          userId,
      );
    }

    console.debug(
      '**** deleteStripeCard().deleting payment method=' +
        input.paymentMethodId,
    );
    const paymentMethod = await deps.stripeClient.paymentMethods.detach(
      input.paymentMethodId,
    );
    console.debug(
      '**** deleteStripeCard().payment method deleted=' + paymentMethod?.id,
    );
    return !!paymentMethod; // true, if not null or undefined -> delete success
  };
