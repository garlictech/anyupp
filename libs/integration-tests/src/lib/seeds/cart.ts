/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { cartSeed } from '../fixtures/cart';
import { tap } from 'rxjs/operators';
import {
  amplifyGraphQlClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';
import {
  AmplifyApi,
  AmplifyApiMutationDocuments,
} from '@bgap/admin/amplify-api';

export const createTestCart = (
  overwrites: Partial<AmplifyApi.CreateCartInput> = {},
) =>
  executeMutation(amplifyGraphQlClient)<AmplifyApi.CreateCartMutation>(
    AmplifyApiMutationDocuments.createCart,
    {
      input: {
        ...cartSeed.cart_01,
        ...overwrites,
      },
    },
  ).pipe(
    tap({
      next(cart) {
        console.log('### new CART created with id: ' + cart.createCart?.id);
      },
    }),
  );

export const deleteTestCart = (id: string = cartSeed.cart_01.id!) =>
  executeMutation(amplifyGraphQlClient)<AmplifyApi.DeleteCartMutation>(
    AmplifyApiMutationDocuments.deleteCart,
    {
      input: { id },
    },
  ).pipe(
    tap({
      next(cart) {
        console.log('### CART deleted with id: ' + cart.deleteCart?.id);
      },
    }),
  );
