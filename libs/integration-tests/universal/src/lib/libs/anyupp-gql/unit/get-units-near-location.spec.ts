import * as CrudApi from '@bgap/crud-gql/api';
import {
  chainFixture,
  groupFixture,
  testAdminUsername,
  testAdminUserPassword,
  testIdPrefix,
  unitFixture,
  maskAll,
} from '@bgap/shared/fixtures';
import {
  filterNullish,
  filterNullishElements,
  throwIfEmptyValue,
} from '@bgap/shared/utils';
import * as fp from 'lodash/fp';
import { combineLatest, from } from 'rxjs';
import { map, delay, switchMap, tap, throwIfEmpty, take } from 'rxjs/operators';
import {
  createAuthenticatedCrudSdk,
  createIamCrudSdk,
} from '../../../../api-clients';
import { createTestChain, deleteTestChain } from '../../../seeds/chain';
import { createTestGroup, deleteTestGroup } from '../../../seeds/group';
import { createTestUnit, deleteTestUnit } from '../../../seeds/unit';
import { unitRequestHandler } from '@bgap/backend/units';
import * as R from 'ramda';

const userLoc = { location: { lat: 47.48992, lng: 19.046135 } }; // distance from seededUnitLoc: 54.649.. km
const distanceLoc_01 = { location: { lat: 47.490108, lng: 19.047077 } }; // distance from userLoc: 0.073.. km
const distanceLoc_02 = { location: { lat: 47.490471, lng: 19.048001 } }; // distance from userLoc: 0.153.. km

const unitNotActive = {
  ...R.clone(unitFixture.createUnit_01),
  isActive: false,
  id: `${testIdPrefix}NOT_ACTIVE_UNIT`,
};

const unit_01 = {
  ...R.clone(unitFixture.createUnit_01),
  id: `${testIdPrefix}unit_01`,
  address: fp.mergeAll([unitFixture.unit_01.address, distanceLoc_01]),
  orderPolicy: CrudApi.OrderPolicy.placeonly,
  serviceFeePolicy: {
    type: CrudApi.ServiceFeeType.applicable,
    percentage: 10,
  },
  ratingPolicies: [
    {
      key: 'question1',
      title: {
        en: 'Question',
      },
      description: {
        en: 'Desc',
      },
      ratings: [{ value: 1, text: { en: 'good' } }],
    },
  ],
  tipPolicy: {
    percents: [2],
  },
  soldOutVisibilityPolicy: CrudApi.SoldOutVisibilityPolicy.faded,
};
const unit_02 = {
  ...R.clone(unitFixture.createUnit_01),
  id: `${testIdPrefix}unit_02`,
  address: fp.mergeAll([unitFixture.unit_01.address, distanceLoc_02]),
  open: {
    from: '1970-01-01',
  },
};

const unit_03 = {
  ...R.clone(unitFixture.createUnit_01),
  id: `${testIdPrefix}unit_03`,
  address: fp.mergeAll([unitFixture.unit_01.address, userLoc]),
};

describe('GetUnitsNearLocation tests', () => {
  const crudSdk = createIamCrudSdk();

  const cleanup = () =>
    combineLatest([
      deleteTestUnit(unitNotActive.id, crudSdk),
      deleteTestUnit(unit_01.id, crudSdk),
      deleteTestUnit(unit_02.id, crudSdk),
      deleteTestUnit(unit_03.id, crudSdk),
      deleteTestGroup(groupFixture.group_01.id, crudSdk),
      deleteTestChain(chainFixture.chain_01.id, crudSdk),
    ]);

  let authCrudSdk: CrudApi.CrudSdk;

  beforeAll(done => {
    createAuthenticatedCrudSdk(testAdminUsername, testAdminUserPassword)
      .pipe(tap(sdk => (authCrudSdk = sdk)))
      .subscribe(() => done());
  }, 10000);

  beforeEach(done => {
    cleanup()
      .pipe(
        switchMap(() =>
          // Seeding
          combineLatest([
            createTestGroup(groupFixture.group_01, crudSdk),
            createTestChain(chainFixture.chain_01, crudSdk),
            createTestUnit(unitNotActive, crudSdk),
            createTestUnit(unit_01, crudSdk),
            createTestUnit(unit_02, crudSdk),
            createTestUnit(unit_03, crudSdk),
          ]),
        ),
        delay(3000),
        take(1),
      )
      .subscribe(() => done());
  }, 10000);

  afterAll(async () => {
    await cleanup().toPromise();
  });

  const testLogic = (
    op: (
      input: CrudApi.QueryGetUnitsNearLocationArgs,
    ) => ReturnType<CrudApi.CrudSdk['GetUnitsNearLocation']>,
  ) => {
    const input: CrudApi.GetUnitsNearLocationQueryVariables = {
      input: userLoc,
    };

    return op(input).pipe(
      throwIfEmptyValue(),
      filterNullish(),
      map(result => result.items),
      filterNullishElements(),
      throwIfEmpty(),
      tap(foundItems => {
        const ids = foundItems.map(x => x.id);
        expect(ids).not.toContain(unitNotActive.id);

        expect(foundItems[0].id).toEqual(unit_03.id);
        expect(foundItems[1].id).toEqual(unit_01.id);
        expect(foundItems[2].id).toEqual(unit_02.id);
        expect(foundItems[0].distance).toEqual(0);
        expect(foundItems[1].distance).toEqual(74);
        expect(foundItems[2].distance).toEqual(153);
        expect(foundItems[0].openingHoursNext7).toHaveLength(7);
        expect(maskAll(foundItems[0])).toMatchSnapshot({
          openingHoursNext7: expect.any(Array),
        });
        expect(maskAll(foundItems[1])).toMatchSnapshot(
          {
            openingHoursNext7: expect.any(Array),
          },
          'retrieved unit_01',
        );
      }),
    );
  };

  it('should return all the units in geoUnitsFormat ordered by distance - using resolver', done => {
    testLogic(unitRequestHandler(crudSdk).getUnitsNearLocation).subscribe(() =>
      done(),
    );
  }, 15000);

  it('should return all the units in geoUnitsFormat ordered by distance - using API', done => {
    testLogic(authCrudSdk.GetUnitsNearLocation).subscribe(() => done());
  }, 15000);
});
