import * as CrudApi from '@bgap/crud-gql/api';
import {
  testAdminUsername,
  testAdminUserPassword,
  maskAll,
} from '@bgap/shared/fixtures';
import { combineLatest, Observable, of } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { createAuthenticatedCrudSdk } from '../../../../api-clients';
import { throwIfEmptyValue } from 'libs/shared/utils/src';
import {
  MutationCreateStripeCardArgs,
  MutationUpdateMyStripeCardArgs,
} from '@bgap/crud-gql/api';

describe('Stripe Payment Method CRUD tests', () => {
  let authAnyuppSdk: CrudApi.CrudSdk;
  let paymentMethodIds: string[];
  let initialPaymentMethodCount: number;
  let tempPaymentMethodId: string;

  const cleanup = () => {
    if (paymentMethodIds) {
      let items: Observable<boolean | undefined | null>[] = [];
      paymentMethodIds?.forEach(paymentMethodId => {
        items.push(
          authAnyuppSdk.DeleteMyStripeCard({ input: { paymentMethodId } }),
        );
      });
      return combineLatest(items);
    } else {
      return of([]);
    }
  };

  beforeAll(done => {
    createAuthenticatedCrudSdk(testAdminUsername, testAdminUserPassword)
      .pipe(
        tap(x => {
          authAnyuppSdk = x;
        }),
      )
      .subscribe(() => done());
  }, 60000);

  afterAll(async () => {
    await cleanup().toPromise();
  }, 60000);

  describe('Stripe Card CRUD', () => {
    beforeEach(done => {
      cleanup()
        .pipe(delay(1000))
        .subscribe(() => done());
    }, 60000);

    const testLogic = ({
      listOp,
      updateOp,
      createOp,
    }: {
      listOp: () => ReturnType<CrudApi.CrudSdk['ListStripeCards']>;
      updateOp: (
        input: MutationUpdateMyStripeCardArgs,
      ) => ReturnType<CrudApi.CrudSdk['UpdateMyStripeCard']>;
      createOp: (
        input: MutationCreateStripeCardArgs,
      ) => ReturnType<CrudApi.CrudSdk['CreateStripeCard']>;
    }) => {
      const calc1 = listOp().pipe(
        tap(result => {
          initialPaymentMethodCount = result ? result.length : -1;
          expect(initialPaymentMethodCount).toBeGreaterThanOrEqual(0);
        }),
        switchMap(() =>
          createOp({
            input: {
              card_number: '4242424242424242',
              cvc: '100',
              exp_month: 12,
              exp_year: 25,
              name: 'Test Card #1',
            },
          }),
        ),
        throwIfEmptyValue(),
        tap(result => {
          tempPaymentMethodId = result.id;
          expect(result).not.toBeNull();
          expect(result.last4).toEqual('4242');
          expect(result.name).toEqual('Test Card #1');
          expect(result.brand).toEqual('visa');
          expect(result.exp_month).toEqual(12);
          expect(result.exp_year).toEqual(2025);
          result.id = 'test_payment_method_id';
          expect(maskAll(result)).toMatchSnapshot('card1');
        }),
        switchMap(() =>
          updateOp({
            input: {
              paymentMethodId: tempPaymentMethodId,
              name: 'Test Card #2',
            },
          }),
        ),
        throwIfEmptyValue(),
      );

      return calc1.pipe(
        tap(result => {
          expect(result).not.toBeNull();
          expect(result.last4).toEqual('4242');
          expect(result.name).toEqual('Test Card #2');
          expect(result.brand).toEqual('visa');
          expect(result.exp_month).toEqual(12);
          expect(result.exp_year).toEqual(2025);
          result.id = 'test_payment_method_id';
          expect(maskAll(result)).toMatchSnapshot('card2');
        }),
        switchMap(listOp),
        tap(result => {
          expect(result).not.toBeNull();
          expect(result?.length).toEqual(initialPaymentMethodCount + 1);
          paymentMethodIds = [];
          result?.map(card => {
            if (card) {
              paymentMethodIds.push(card?.id);
            }
          });
        }),
      );
    };

    it('should list, create, update and delete Stripe cards', done => {
      const config = {
        listOp: () =>
          authAnyuppSdk.ListStripeCards(undefined, {
            fetchPolicy: 'network-only',
          }),
        createOp: authAnyuppSdk.CreateStripeCard,
        updateOp: (input: CrudApi.MutationUpdateMyStripeCardArgs) =>
          authAnyuppSdk.UpdateMyStripeCard(input, {
            fetchPolicy: 'network-only',
          }),
      };

      testLogic(config).subscribe(() => done());
    }, 60000);
  });

  describe('Stripe Card CRUD error testing', () => {
    it('should throw error when try to update a card that not exists', done => {
      authAnyuppSdk
        .UpdateMyStripeCard(
          {
            input: {
              paymentMethodId: 'payment_method_id_that_does_not_exists',
              name: 'Test Card Error',
            },
          },
          {
            fetchPolicy: 'network-only',
          },
        )
        .subscribe(
          success => {
            expect(success).toBeFalsy();
          },
          () => {
            //--- Ok if there was an error!
            done();
          },
          () => {},
        );
    }, 60000);
  });
});
