import Stripe from 'stripe';

import {
  CreateUserMutationVariables,
  UpdateUserMutationVariables,
  UserInvoiceAddress,
} from '@bgap/domain';

import { loadUser } from '../stripe-graphql-crud';
import { StripeResolverDeps } from '../stripe.utils';

export const loadAndConnectUserForStripe =
  (
    userId: string,
    createStripeUser = true,
    invoiceAddress: UserInvoiceAddress | undefined | null = undefined,
  ) =>
  async (deps: StripeResolverDeps) => {
    let user = await loadUser()(deps);
    console.debug('loadAndConnectUserForStripe().user.id=' + user?.id);
    console.debug(
      'loadAndConnectUserForStripe().createStripeUser=' + createStripeUser,
    );

    if (!user) {
      let customerId: string | undefined;

      if (createStripeUser === true) {
        const stripeCustomer: Stripe.Response<Stripe.Customer> =
          await deps.stripeClient.customers.create();
        console.debug(
          'loadAndConnectUserForStripe().stripe.customerId=' +
            stripeCustomer.id,
        );
        customerId = stripeCustomer.id;
      }

      const createUserVars: CreateUserMutationVariables = {
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
      user = await deps.crudSdk.CreateUser(createUserVars).toPromise();
    } else {
      // USER ALREADY EXISTS...
      let customerId = user.stripeCustomerId;
      if (!user.stripeCustomerId && createStripeUser === true) {
        console.debug('loadAndConnectUserForStripe().Creating stripe customer');
        const stripeCustomer: Stripe.Response<Stripe.Customer> =
          await deps.stripeClient.customers.create();
        customerId = stripeCustomer.id;
      }
      const updateUserVars: UpdateUserMutationVariables = {
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
