/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineLatest, from } from 'rxjs';

import { AppsyncApi } from '@bgap/api/graphql/schema';
import { unitRequestHandler } from '@bgap/api/unit';
import { amplifyGraphQlClient } from '@bgap/shared/graphql/api-client';
import { unitSeed } from '../../../fixtures/unit';
import { createTestUnit, deleteTestUnit } from '../../../seeds/unit';
import { switchMap } from 'rxjs/operators';

const unitNotActive = { isActive: false, id: 'NOT_ACTIVE_UNIT' };

describe('GetUnitsNearLocation tests', () => {
  beforeAll(async () => {
    await combineLatest([
      // CleanUP
      deleteTestUnit(),
      deleteTestUnit(unitNotActive.id),
    ])
      .pipe(
        switchMap(() =>
          // Seeding
          combineLatest([createTestUnit(unitNotActive), createTestUnit()]),
        ),
      )
      .toPromise();
  });

  describe('input validation', () => {
    it('should throw without a input', done => {
      const input: AppsyncApi.GetUnitsNearLocationQueryVariables = {} as any;
      from(
        unitRequestHandler.getUnitsInRadius(amplifyGraphQlClient)(input),
      ).subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
    });
    it('should throw without a location input', done => {
      const input: AppsyncApi.GetUnitsNearLocationQueryVariables = {
        input: {},
      } as any;
      from(
        unitRequestHandler.getUnitsInRadius(amplifyGraphQlClient)(input),
      ).subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
    });
    it('should throw without a lat arg in the location input', done => {
      const input: AppsyncApi.GetUnitsNearLocationQueryVariables = {
        input: { location: { lat: '12' } },
      } as any;
      from(
        unitRequestHandler.getUnitsInRadius(amplifyGraphQlClient)(input),
      ).subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
    });
    it('should throw without a lng arg in the location input', done => {
      const input: AppsyncApi.GetUnitsNearLocationQueryVariables = {
        input: { location: { lng: '12' } },
      } as any;
      from(
        unitRequestHandler.getUnitsInRadius(amplifyGraphQlClient)(input),
      ).subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
    });
    // it('should throw without valid location input', done => {
    //   const input: AppsyncApi.GetUnitsNearLocationQueryVariables = {
    //     input: { location: { lng: '230.0000', lat: '-1oo' } },
    //   } as any;
    //   from(unitRequestHandler.getUnitsInRadius(amplifyGraphQlClient)(input)).subscribe({
    //     error(e) {
    //       expect(e).toMatchSnapshot();
    //       done();
    //     },
    //   });
    // });
  });

  it.only('should return all the units', done => {
    const input: AppsyncApi.GetUnitsNearLocationQueryVariables = {
      input: { location: { lng: '30', lat: '-1o' } },
    };
    from(
      unitRequestHandler.getUnitsInRadius(amplifyGraphQlClient)(input),
    ).subscribe({
      next(result) {
        console.log(
          '### ~ file: get-units-near-location.spec.ts ~ line 88 ~ next ~ foundItems',
          result,
        );
        expect(result).toHaveProperty('items');
        const foundItems: Array<AppsyncApi.GeoUnit> = result.items;
        expect(foundItems.length).toEqual(4);
        const ids = foundItems.map(x => x.id);
        expect(ids).toContain(unitSeed.unitId_seeded_01);
        expect(ids).toContain(unitSeed.unitId_seeded_02);
        expect(ids).toContain(unitSeed.unitId_seeded_03);
        expect(ids).not.toContain(unitNotActive.id);
        // expect(foundItems[1].unitId).toEqual("5");
        // expect(foundItems[2].unitId).toEqual("3");
        // expect(foundItems[3].unitId).toEqual("2");
        // expect(foundItems[0].distance).toEqual(0);
        // expect(foundItems[1].distance).toEqual(80);
        // expect(foundItems[2].distance).toEqual(98);
        // expect(foundItems[3].distance).toEqual(178);
        done();
      },
    });
  }, 15000);
});
