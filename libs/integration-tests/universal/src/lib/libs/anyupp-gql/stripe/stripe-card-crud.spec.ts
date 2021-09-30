import * as CrudApi from '@bgap/crud-gql/api';
import {
  testAdminUsername,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import { combineLatest, Observable, of } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { createAuthenticatedAnyuppSdk } from '../../../../api-clients';

describe('Stripe Payment Method CRUD tests', () => {
  let authAnyuppSdk: CrudApi.AnyuppSdk;
  let paymentMethodIds: string[];
  let initialPaymentMethodCount: number;
  let tempPaymentMethodId: string;

  const cleanup = () => {
    // console.debug('cleanup()');
    if (paymentMethodIds) {
      let items: Observable<boolean>[] = [];
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
    // console.debug('beforeAll()');
    createAuthenticatedAnyuppSdk(testAdminUsername, testAdminUserPassword)
      .pipe(
        tap(x => {
          // console.debug('beforeAll().createAuthenticatedAnyuppSdk.tap()=' + x);
          authAnyuppSdk = x.authAnyuppSdk;
        }),
        switchMap(cleanup),
        delay(1000),
      )
      .subscribe(() => done());
  }, 10000);

  afterAll(async () => {
    // console.debug('afterAll()');
    await cleanup().toPromise();
  });

  describe('Stripe Card CRUD', () => {
    it('should list, create, update and delete Stripe cards', done => {
      // console.debug('List all Stripe Cards');
      authAnyuppSdk
        .ListStripeCards(undefined, {
          fetchPolicy: 'network-only',
        })
        .pipe(
          // tap(cards => console.log('********* CARDS=' + cards?.length)),
          tap(result => {
            initialPaymentMethodCount = result ? result.length : -1;
            expect(initialPaymentMethodCount).toBeGreaterThanOrEqual(0);
          }),
          switchMap(() =>
            authAnyuppSdk.CreateStripeCard({
              input: {
                card_number: '4242424242424242',
                cvc: '100',
                exp_month: 12,
                exp_year: 25,
                name: 'Test Card #1',
              },
            }),
          ),
          tap(result => {
            // console.log('*********** Payment method=' + result?.id);
            tempPaymentMethodId = result.id;
            expect(result).not.toBeNull();
            expect(result.last4).toEqual('4242');
            expect(result.name).toEqual('Test Card #1');
            expect(result.brand).toEqual('visa');
            expect(result.exp_month).toEqual(12);
            expect(result.exp_year).toEqual(2025);
            result.id = 'test_payment_method_id';
            expect(result).toMatchSnapshot('card1');
          }),
          switchMap(() =>
            authAnyuppSdk.UpdateMyStripeCard(
              {
                input: {
                  paymentMethodId: tempPaymentMethodId,
                  name: 'Test Card #2',
                },
              },
              {
                fetchPolicy: 'network-only',
              },
            ),
          ),
          tap(result => {
            // console.log('*********** Payment method2=' + result?.id);
            expect(result).not.toBeNull();
            expect(result.last4).toEqual('4242');
            expect(result.name).toEqual('Test Card #2');
            expect(result.brand).toEqual('visa');
            expect(result.exp_month).toEqual(12);
            expect(result.exp_year).toEqual(2025);
            result.id = 'test_payment_method_id';
            expect(result).toMatchSnapshot('card2');
          }),
          switchMap(() =>
            authAnyuppSdk.ListStripeCards(undefined, {
              fetchPolicy: 'network-only',
            }),
          ),
          tap(result => {
            // console.log('*********** CARDS2=' + result?.length);
            expect(result).not.toBeNull();
            // expect(result?.length).toBeGreaterThanOrEqual(1);
            expect(result?.length).toEqual(initialPaymentMethodCount + 1);
            paymentMethodIds = [];
            result?.map(card => {
              if (card) {
                paymentMethodIds.push(card?.id);
              }
            });
          }),
          tap(() => done()),
        )
        .subscribe({
          error(err) {
            console.error(`Test ERROR`, err);
            done();
          },
        });
    }, 45000);
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
    }, 30000);
  });
});
