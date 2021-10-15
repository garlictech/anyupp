import * as CrudApi from '@bgap/crud-gql/api';
import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { unitRequestHandler } from '@bgap/anyupp-gql/backend';
import {
  chainFixture,
  groupFixture,
  testAdminUsername,
  testAdminUserPassword,
  testIdPrefix,
  unitFixture,
} from '@bgap/shared/fixtures';
import {
  defaultSupportedOrderModes,
  defaultSupportedServingModes,
} from '@bgap/shared/types';
import {
  filterNullish,
  filterNullishElements,
  throwIfEmptyValue,
} from '@bgap/shared/utils';
import * as fp from 'lodash/fp';
import { combineLatest, from } from 'rxjs';
import { map, switchMap, tap, throwIfEmpty, delay, take } from 'rxjs/operators';
import {
  createAuthenticatedAnyuppSdk,
  createAuthenticatedCrudSdk,
  createIamCrudSdk,
} from '../../../../api-clients';
import { createTestChain, deleteTestChain } from '../../../seeds/chain';
import { createTestGroup, deleteTestGroup } from '../../../seeds/group';
import { createTestUnit, deleteTestUnit } from '../../../seeds/unit';

const userLoc = { location: { lat: 47.48992, lng: 19.046135 } }; // distance from seededUnitLoc: 54.649.. km
const distanceLoc_01 = { location: { lat: 47.490108, lng: 19.047077 } }; // distance from userLoc: 0.073.. km
const distanceLoc_02 = { location: { lat: 47.490471, lng: 19.048001 } }; // distance from userLoc: 0.153.. km
// const distanceLoc_03 = { location: { lat: 47.490877, lng: 19.04916 } }; // distance from userLoc: 0.250.. km
// const distanceLoc_04 = { location: { lat: 47.49121, lng: 19.050105 } }; // distance from userLoc: 0.330.. km
// const distanceLoc_05 = { location: { lat: 47.491979, lng: 19.05219 } }; // distance from userLoc: 0.509.. km
// const distanceLoc_06 = { location: { lat: 47.493168, lng: 19.055454 } }; // distance from userLoc: 0.787.. km

const DYNAMODB_OPERATION_DELAY = 1000;

const unitNotActive = {
  ...unitFixture.createUnit_01,
  isActive: false,
  id: `${testIdPrefix}NOT_ACTIVE_UNIT`,
};

const unit_01 = {
  ...unitFixture.createUnit_01,
  id: `${testIdPrefix}unit_01`,
  address: fp.mergeAll([unitFixture.unit_01.address, distanceLoc_01]),
};
const unit_02 = {
  ...unitFixture.createUnit_01,
  id: `${testIdPrefix}unit_02`,
  address: fp.mergeAll([unitFixture.unit_01.address, distanceLoc_02]),
  open: {
    from: '1970-01-01',
  },
};

describe('GetUnitsNearLocation tests', () => {
  const crudSdk = createIamCrudSdk();

  const cleanup = () =>
    combineLatest([
      deleteTestUnit(unitNotActive.id, crudSdk),
      deleteTestUnit(unit_01.id, crudSdk),
      deleteTestUnit(unit_02.id, crudSdk),
      deleteTestGroup(groupFixture.group_01.id, crudSdk),
      deleteTestChain(chainFixture.chain_01.id, crudSdk),
    ]);

  let authAnyuppSdk: AnyuppApi.AnyuppSdk;
  let authCrudSdk: CrudApi.CrudSdk;

  beforeAll(done => {
    createAuthenticatedAnyuppSdk(testAdminUsername, testAdminUserPassword)
      .pipe(
        tap(x => {
          authAnyuppSdk = x.authAnyuppSdk;
        }),
        switchMap(() =>
          createAuthenticatedCrudSdk(testAdminUsername, testAdminUserPassword),
        ),
        tap(sdk => (authCrudSdk = sdk)),
      )
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
          ]),
        ),
        take(1),
      )
      .subscribe(() => done());
  });

  afterAll(async () => {
    await cleanup().toPromise();
  });

  describe('input validation', () => {
    it('should throw without an input', done => {
      const input: CrudApi.GetUnitsNearLocationQueryVariables = {} as any;
      from(unitRequestHandler(crudSdk).getUnitsNearLocation(input)).subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
    }, 15000);

    it('should throw without a location input', done => {
      const input: CrudApi.GetUnitsNearLocationQueryVariables = {
        input: {},
      } as any;
      from(unitRequestHandler(crudSdk).getUnitsNearLocation(input)).subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
    }, 15000);

    it('should throw without a lat arg in the location input', done => {
      const input: CrudApi.GetUnitsNearLocationQueryVariables = {
        input: { location: { lat: 12 } },
      } as any;

      from(unitRequestHandler(crudSdk).getUnitsNearLocation(input)).subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
    }, 15000);

    it('should throw without a lng arg in the location input', done => {
      const input: CrudApi.GetUnitsNearLocationQueryVariables = {
        input: { location: { lng: '12' } },
      } as any;
      from(unitRequestHandler(crudSdk).getUnitsNearLocation(input)).subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
    }, 15000);

    it('should throw without valid location input', done => {
      const input: CrudApi.GetUnitsNearLocationQueryVariables = {
        input: { location: { lng: 230.0, lat: -100 } },
      };

      // from(unitRequestHandler(deps).getUnitsNearLocation(input)); // FOR DEBUG
      authAnyuppSdk.GetUnitsNearLocation(input).subscribe({
        error(e) {
          expect(e).toMatchSnapshot('OLD API');
          done();
        },
      });

      authCrudSdk.GetUnitsNearLocation(input).subscribe({
        error(e) {
          expect(e).toMatchSnapshot('NEW API');
          done();
        },
      });
    }, 15000);
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
        expect(foundItems).toMatchSnapshot();
        expect(foundItems[0].openingHoursNext7).toHaveLength(7);
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

  it('should return all the units in geoUnitsFormat ordered by distance - using old API', done => {
    testLogic(authAnyuppSdk.GetUnitsNearLocation).subscribe(() => done());
  }, 15000);
});
