import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { unitRequestHandler } from '@bgap/anyupp-gql/backend';
import {
  chainFixture,
  groupFixture,
  testAdminEmail,
  testAdminUserPassword,
  testIdPrefix,
  unitFixture,
} from '@bgap/shared/fixtures';
import { filterNullish, filterNullishElements } from '@bgap/shared/utils';
import { listStripeCards } from 'libs/anyupp-gql/backend/src/lib/lambda-resolvers/stripe/handlers/list-stripe-cards';
import * as fp from 'lodash/fp';
import { combineLatest, from, Observable, of } from 'rxjs';
import { delay, map, switchMap, tap, throwIfEmpty } from 'rxjs/operators';
import {
  createAuthenticatedAnyuppSdk,
  createIamCrudSdk,
} from '../../../../api-clients';
import {
  createTestPaymentMethod,
  deleteTestPaymentMethod,
} from '../../../seeds/stripe';

describe('Stripe Payment Method CRUD tests', () => {
  let authAnyuppSdk: AnyuppApi.AnyuppSdk;
  let paymentMethodIds: string[];

  beforeAll(done => {
    // console.debug('beforeAll()');
    createAuthenticatedAnyuppSdk(testAdminEmail, testAdminUserPassword)
      .pipe(
        tap(x => {
          // console.debug('beforeAll().createAuthenticatedAnyuppSdk.tap()=' + x);
          authAnyuppSdk = x.authAnyuppSdk;
        }),
        switchMap(cleanup),
        // switchMap(() =>
        //     // Seeding
        //     combineLatest([
        //         createTestGroup(groupFixture.group_01, crudSdk),
        //         createTestChain(chainFixture.chain_01, crudSdk),
        //         createTestUnit(unitNotActive, crudSdk),
        //         createTestUnit(unit_01, crudSdk),
        //         createTestUnit(unit_02, crudSdk),
        //         createTestUnit(unit_03, crudSdk),
        //     ]),
        // ),
        delay(3000),
      )
      .subscribe(() => done());
  }, 10000);

  afterAll(async () => {
    // console.debug('afterAll()');
    await cleanup().toPromise();
  });

  const cleanup = () => {
    // console.debug('cleanup()');
    if (paymentMethodIds) {
      let items: Observable<boolean>[] = [];
      paymentMethodIds?.forEach(paymentIntentId => {
        items.push(deleteTestPaymentMethod(paymentIntentId, authAnyuppSdk));
      });
      return combineLatest(items);
    } else {
      return of([]);
    }
  };

  describe('Stripe Card CRUD', () => {
    it('should list all Stripe Cards', done => {
      // console.debug('List all Stripe Cards');
      authAnyuppSdk
        .ListStripeCards(undefined, {
          fetchPolicy: 'network-only',
        })
        .pipe(
          tap(cards => console.log('********* CARDS=' + cards?.length)),
          tap(result => {
            expect(result?.length).toBeGreaterThanOrEqual(0);
          }),
          switchMap(() =>
            createTestPaymentMethod(
              {
                card_number: '4242424242424242',
                cvc: '100',
                exp_month: 12,
                exp_year: 25,
                name: 'Test Card #1',
              },
              authAnyuppSdk,
            ),
          ),
          tap(result => {
            console.log('*********** Payment method=' + result?.id);
            expect(result).not.toBeNull();
            expect(result.last4).toEqual('4242');
            expect(result.name).toEqual('Test Card #1');
            expect(result.brand).toEqual('visa');
            expect(result.exp_month).toEqual(12);
            expect(result.exp_year).toEqual(2025);
          }),
          // delay(2000),
          switchMap(() =>
            authAnyuppSdk.ListStripeCards(undefined, {
              fetchPolicy: 'network-only',
            }),
          ),
          tap(result => {
            console.log('*********** CARDS2=' + result?.length);
            expect(result).not.toBeNull();
            expect(result?.length).toBeGreaterThanOrEqual(0);
            paymentMethodIds = [];
            result?.forEach(card => {
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
    }, 60000);
  });
});
