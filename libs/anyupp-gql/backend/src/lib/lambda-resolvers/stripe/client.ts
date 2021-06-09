import { Stripe } from 'stripe';

export const createStripeClient = (secret: string) => {
  return new Stripe(secret, {
    apiVersion: '2020-08-27',
  });
};
