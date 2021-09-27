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
import { filterNullish, filterNullishElements } from '@bgap/shared/utils';
import * as fp from 'lodash/fp';
import { combineLatest, from } from 'rxjs';
import { map, switchMap, tap, throwIfEmpty } from 'rxjs/operators';
import {
  createAuthenticatedAnyuppSdk,
  createIamCrudSdk,
} from '../../../../api-clients';
import { createTestChain, deleteTestChain } from '../../../seeds/chain';
import { createTestGroup, deleteTestGroup } from '../../../seeds/group';
import { createTestUnit, deleteTestUnit } from '../../../seeds/unit';

const TEST_NAME = 'GEOUNIT_';
const userLoc = { location: { lat: 47.48992, lng: 19.046135 } }; // distance from seededUnitLoc: 54.649.. km
const distanceLoc_01 = { location: { lat: 47.490108, lng: 19.047077 } }; // distance from userLoc: 0.073.. km
const distanceLoc_02 = { location: { lat: 47.490471, lng: 19.048001 } }; // distance from userLoc: 0.153.. km
// const distanceLoc_03 = { location: { lat: 47.490877, lng: 19.04916 } }; // distance from userLoc: 0.250.. km
// const distanceLoc_04 = { location: { lat: 47.49121, lng: 19.050105 } }; // distance from userLoc: 0.330.. km
// const distanceLoc_05 = { location: { lat: 47.491979, lng: 19.05219 } }; // distance from userLoc: 0.509.. km
// const distanceLoc_06 = { location: { lat: 47.493168, lng: 19.055454 } }; // distance from userLoc: 0.787.. km

const unitNotActive = {
  ...unitFixture.unit_01,
  isActive: false,
  id: `${testIdPrefix}NOT_ACTIVE_UNIT`,
};

const unit_01 = {
  ...unitFixture.unit_01,
  id: `${testIdPrefix}unit_01`,
  address: fp.mergeAll([unitFixture.unit_01.address, distanceLoc_01]),
};
const unit_02 = {
  ...unitFixture.unit_01,
  id: `${testIdPrefix}unit_02`,
  address: fp.mergeAll([unitFixture.unit_01.address, distanceLoc_02]),
};
const unit_03 = {
  ...unitFixture.unit_01,
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

  let authAnyuppSdk: AnyuppApi.AnyuppSdk;

  beforeAll(done => {
    createAuthenticatedAnyuppSdk(testAdminUsername, testAdminUserPassword)
      .pipe(
        tap(x => {
          authAnyuppSdk = x.authAnyuppSdk;
        }),
        switchMap(cleanup),
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
      )
      .subscribe(() => done());
  }, 10000);

  afterAll(async () => {
    await cleanup().toPromise();
  });

  describe('input validation', () => {
    it('should throw without an input', done => {
      const input: AnyuppApi.GetUnitsNearLocationQueryVariables = {} as any;
      from(
        unitRequestHandler({ crudSdk }).getUnitsNearLocation(input),
      ).subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
    }, 15000);

    it('should throw without a location input', done => {
      const input: AnyuppApi.GetUnitsNearLocationQueryVariables = {
        input: {},
      } as any;
      from(
        unitRequestHandler({ crudSdk }).getUnitsNearLocation(input),
      ).subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
    }, 15000);

    it('should throw without a lat arg in the location input', done => {
      const input: AnyuppApi.GetUnitsNearLocationQueryVariables = {
        input: { location: { lat: 12 } },
      } as any;

      from(
        unitRequestHandler({ crudSdk }).getUnitsNearLocation(input),
      ).subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
    }, 15000);

    it('should throw without a lng arg in the location input', done => {
      const input: AnyuppApi.GetUnitsNearLocationQueryVariables = {
        input: { location: { lng: '12' } },
      } as any;
      from(
        unitRequestHandler({ crudSdk }).getUnitsNearLocation(input),
      ).subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
    }, 15000);

    it('should throw without valid location input', done => {
      const input: AnyuppApi.GetUnitsNearLocationQueryVariables = {
        input: { location: { lng: 230.0, lat: -100 } },
      };

      // from(unitRequestHandler({ crudSdk }).getUnitsNearLocation(input)); // FOR DEBUG
      authAnyuppSdk.GetUnitsNearLocation(input).subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
    }, 15000);
  });

  it('should return all the units in geoUnitsFormat ordered by distance', done => {
    const input: AnyuppApi.GetUnitsNearLocationQueryVariables = {
      input: userLoc,
    };
    authAnyuppSdk
      .GetUnitsNearLocation(input)
      .pipe(
        filterNullish(),
        map(result => result.items),
        filterNullishElements(),
        throwIfEmpty(),
      )
      .subscribe({
        next(foundItems) {
          const ids = foundItems.map(x => x.id);
          expect(ids).not.toContain(unitNotActive.id);

          expect(foundItems[0].id).toEqual(unit_03.id);
          expect(foundItems[1].id).toEqual(unit_01.id);
          expect(foundItems[2].id).toEqual(unit_02.id);
          expect(foundItems[0].distance).toEqual(0);
          expect(foundItems[1].distance).toEqual(74);
          expect(foundItems[2].distance).toEqual(153);
          expect(foundItems[0].openingHoursNext7).toHaveLength(7);
          expect(foundItems[0].supportedOrderModes).toEqual(
            unit_03.supportedOrderModes,
          );
          expect(foundItems[0].supportedServingModes).toEqual(
            unit_03.supportedServingModes,
          );

          expect(foundItems[0]).toMatchSnapshot({
            openingHoursNext7: expect.any(Array),
          });
          done();
        },
        error(err) {
          console.error(`${TEST_NAME}Test ERROR`, err);
        },
      });
  }, 15000);
});
