/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { cartSeed } from '../fixtures/cart';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
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
      error(err) {
        console.error('Error during test cart creation', err.message);
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
    catchError(err => {
      console.error('Error during cart delete with id:' + id, err.message);
      return throwError(
        `Error during cart delete with id: ${id}, Err: ${err.message}`,
      );
    }),
  );
