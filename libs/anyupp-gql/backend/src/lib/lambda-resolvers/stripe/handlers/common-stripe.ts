import * as CrudApi from '@bgap/crud-gql/api';
import Stripe from 'stripe';
import { loadUser } from '../stripe-graphql-crud';
import { StripeResolverDeps } from '../stripe.utils';

export const loadAndConnectUserForStripe =
  (
    userId: string,
    createStripeUser = true,
    invoiceAddress: CrudApi.UserInvoiceAddress | undefined | null = undefined,
  ) =>
  async (deps: StripeResolverDeps) => {
    let user = await loadUser(userId)(deps);
    console.debug('loadAndConnectUserForStripe().user.id=' + user?.id);

    if (!user) {
      let customerId: string | undefined;

      if (createStripeUser === true) {
        const stripeResponse: Stripe.Response<Stripe.Customer> =
          await deps.stripeClient.customers.create();
        console.debug(
          'loadAndConnectUserForStripe().stripe.customerId=' +
            stripeResponse.id,
        );
        customerId = stripeResponse.id;
      }

      const createUserVars: CrudApi.CreateUserMutationVariables = {
        input: {
          id: userId,
          stripeCustomerId: customerId,
          invoiceAddress: invoiceAddress
            ? {
                city: invoiceAddress.city,
                country: invoiceAddress.country,
                postalCode: invoiceAddress.postalCode,
                email: invoiceAddress.email,
                streetAddress: invoiceAddress.streetAddress,
                taxNumber: invoiceAddress.taxNumber,
                customerName: invoiceAddress.customerName,
              }
            : undefined,
        },
      };
      user = await deps.crudSdk.CreateUser(createUserVars).toPromise(); //createUser(userId, customerId)(deps);
      // console.debug('loadAndConnectUserForStripe().User created=' + user?.id);
    } else {
      // USER ALREADY EXISTS...
      let customerId = user.stripeCustomerId;
      if (!user.stripeCustomerId && createStripeUser === true) {
        // console.debug('loadAndConnectUserForStripe().Creating stripe customer');
        const stripeResponse: Stripe.Response<Stripe.Customer> =
          await deps.stripeClient.customers.create();
        customerId = stripeResponse.id;
      }
      const updateUserVars: CrudApi.UpdateUserMutationVariables = {
        input: {
          id: userId,
          stripeCustomerId: customerId,
          invoiceAddress: invoiceAddress
            ? {
                city: invoiceAddress.city,
                country: invoiceAddress.country,
                postalCode: invoiceAddress.postalCode,
                email: invoiceAddress.email,
                streetAddress: invoiceAddress.streetAddress,
                taxNumber: invoiceAddress.taxNumber,
                customerName: invoiceAddress.customerName,
              }
            : undefined,
        },
      };
      user = await deps.crudSdk.UpdateUser(updateUserVars).toPromise(); //await updateUser(userId, customerId)(deps);
      console.debug(
        'loadAndConnectUserForStripe().User stripe customer id created=' +
          user?.id,
      );
    }

    return user;
  };

// TODO
export const handleStripeErrors = (error: Stripe.StripeError) => {
  switch (error.type) {
    case 'StripeCardError':
      // A declined card error
      // error.message; // => e.g. "Your card's expiration year is invalid."
      break;
    case 'StripeRateLimitError':
      // Too many requests made to the API too quickly
      break;
    case 'StripeInvalidRequestError':
      // Invalid parameters were supplied to Stripe's API
      break;
    case 'StripeAPIError':
      // An error occurred internally with Stripe's API
      break;
    case 'StripeConnectionError':
      // Some kind of error occurred during the HTTPS communication
      break;
    case 'StripeAuthenticationError':
      // You probably used an incorrect API key
      break;
    case 'StripeError':
      break;
    default:
      // Handle any other types of unexpected errors
      break;
  }
  console.error(error.message, error);
  throw error;
};
