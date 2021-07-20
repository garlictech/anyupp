import * as CrudApi from '@bgap/crud-gql/api';
import { unitFixture } from '@bgap/shared/fixtures';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { isUnit, validateUnit } from './unit';

const unitValid: CrudApi.Unit = {
  ...unitFixture.unit_01,
  createdAt: 'CREATED_AT',
  updatedAt: 'UPDATED_AT',
};

describe('Unit validaton test', () => {
  it('should be valid', async () => {
    expect(await validateUnit(unitValid).toPromise()).toMatchInlineSnapshot(`
      Object {
        "address": Object {
          "address": "Ág u. 1.",
          "city": "Budapest",
          "country": "Magyarország",
          "location": Object {
            "lat": 47,
            "lng": 19,
          },
          "postalCode": "1021",
          "title": "HQ",
        },
        "chainId": "test_chain_1_id",
        "createdAt": "CREATED_AT",
        "description": Object {
          "en": "Test unit #test_unit_1_id description",
          "hu": "Teszt unit #test_unit_1_id leírás",
        },
        "groupId": "test_group_1_id",
        "id": "test_unit_1_id",
        "isAcceptingOrders": true,
        "isActive": true,
        "lanes": Array [
          Object {
            "color": "#e72222",
            "id": "lane_01",
            "name": "bár",
          },
          Object {
            "color": "#e123ef",
            "id": "lane_02",
            "name": "konyha",
          },
        ],
        "name": "Késdobáló S",
        "open": Object {
          "from": "1970-01-01",
        },
        "paymentModes": Array [
          Object {
            "method": "cash",
            "type": "cash",
          },
          Object {
            "method": "card",
            "type": "card",
          },
          Object {
            "method": "inapp",
            "type": "stripe",
          },
        ],
        "updatedAt": "UPDATED_AT",
      }
      `);
    expect(isUnit(unitValid)).toEqual(true);
  });

  it('should be inValid', async () => {
    const { id, ...invalidUnit } = unitValid;
    await validateUnit(invalidUnit)
      .toPromise()
      .catch(error => {
        expect(error).toMatchInlineSnapshot(
          `"Unit Object Validation Error (JOI): \\"id\\" is required"`,
        );
      });
    expect(isUnit(invalidUnit)).toEqual(false);
  });

  describe('open field validator', () => {
    it('should throw in case none of the fields exists', async () => {
      const invalidUnit = {
        ...unitValid,
        open: {},
      };

      expect(isUnit(invalidUnit)).toEqual(false);
      await validateUnit(invalidUnit)
        .toPromise()
        .catch(error => {
          expect(error).toMatchInlineSnapshot(
            `"Unit Object Validation Error (JOI): \\"open\\" must contain at least one of [from, to]"`,
          );
        });
    });

    it('should be valid in case the from field is exists', async () => {
      const unit = {
        ...unitValid,
        open: { from: '2011-12-24' },
      };
      expect(isUnit(unit)).toEqual(true);
    });
    it('should be valid in case the to field is exists', async () => {
      const unit = {
        ...unitValid,
        open: { to: '1970-01-30' },
      };
      expect(isUnit(unit)).toEqual(true);
    });
    it('should be valid in case both the to and from fields are exist', async () => {
      const unit = {
        ...unitValid,
        open: { to: '9999-12-01', from: '2011-12-24' },
      };
      expect(isUnit(unit)).toEqual(true);
    });
    it('should be valid without open field because it is optional', async () => {
      const unit = {
        ...unitValid,
        open: null,
      };
      expect(isUnit(unit)).toEqual(true);
    });
  });

  describe('openingHours field validator', () => {
    it('should be valid without openingHours field because it is optional', async () => {
      const unit = {
        ...unitValid,
        openingHours: null,
      };
      expect(isUnit(unit)).toEqual(true);
    });
    it('should be valid with an empty openingHours field because none of its fields are required', async () => {
      const unit = {
        ...unitValid,
        openingHours: {},
      };
      expect(isUnit(unit)).toEqual(true);
    });
    it('should be valid with an empty openingHours field because none of its fields are required', async () => {
      const unit = {
        ...unitValid,
        openingHours: {},
      };
      expect(isUnit(unit)).toEqual(true);
    });
    it('should be valid with empty strings as from and to', async () => {
      const unit = {
        ...unitValid,
        openingHours: {
          mon: {
            from: '',
            to: '',
          },
        },
      };
      expect(isUnit(unit)).toEqual(true);
    });
    it('should be valid with HH:MM strings as from and to', async () => {
      const unit = {
        ...unitValid,
        openingHours: {
          mon: {
            from: '09:00',
            to: '09:30',
          },
        },
      };
      expect(isUnit(unit)).toEqual(true);
    });
    it('should throw in case only one of the from/to fields are empty strings', async () => {
      const invalidUnit = {
        ...unitValid,
        openingHours: {
          mon: {
            from: '',
            to: '09:30',
          },
        },
      };
      await validateUnit(invalidUnit)
        .toPromise()
        .catch(error => {
          expect(error).toMatchInlineSnapshot(
            `"Unit Object Validation Error (JOI): \\"openingHours.mon\\" does not match any of the allowed types"`,
          );
        });
      expect(isUnit(invalidUnit)).toEqual(false);
      const invalidUnit02 = {
        ...unitValid,
        openingHours: {
          mon: {
            from: '09:30',
            to: '',
          },
        },
      };
      await validateUnit(invalidUnit02)
        .toPromise()
        .catch(error => {
          expect(error).toMatchInlineSnapshot(
            `"Unit Object Validation Error (JOI): \\"openingHours.mon\\" does not match any of the allowed types"`,
          );
        });
      expect(isUnit(invalidUnit02)).toEqual(false);
    });

    it('should throw in case of an unknown fields in the openingHours', async () => {
      const invalidUnit = {
        ...unitValid,
        openingHours: {
          notKnownField: 'SHOULD THROW',
        },
      };

      expect(isUnit(invalidUnit)).toEqual(false);
      await validateUnit(invalidUnit)
        .toPromise()
        .catch(error => {
          expect(error).toMatchInlineSnapshot(
            `"Unit Object Validation Error (JOI): \\"openingHours.notKnownField\\" is not allowed"`,
          );
        });
    });

    it('should throw in case the timeIntervals are not valid', async () => {
      const invalidUnit = {
        ...unitValid,
        openingHours: {
          mon: {},
          tue: {},
          wed: {},
          thu: {},
          fri: {},
          sat: {},
          sun: {},
        },
      };

      expect(isUnit(invalidUnit)).toEqual(false);
      await validateUnit(invalidUnit)
        .toPromise()
        .catch(error => {
          expect(error).toMatchInlineSnapshot(
            `"Unit Object Validation Error (JOI): \\"openingHours.mon\\" does not match any of the allowed types, \\"openingHours.tue\\" does not match any of the allowed types, \\"openingHours.wed\\" does not match any of the allowed types, \\"openingHours.thu\\" does not match any of the allowed types, \\"openingHours.fri\\" does not match any of the allowed types, \\"openingHours.sat\\" does not match any of the allowed types, \\"openingHours.sun\\" does not match any of the allowed types"`,
          );
        });
    });

    it('should throw in case the customDailySchedule is not valid', async () => {
      const invalidUnit = {
        ...unitValid,
        openingHours: {
          custom: [{}],
        },
      };

      expect(isUnit(invalidUnit)).toEqual(false);
      await validateUnit(invalidUnit)
        .toPromise()
        .catch(error => {
          expect(error).toMatchInlineSnapshot(
            `"Unit Object Validation Error (JOI): \\"openingHours.custom[0].date\\" is required"`,
          );
        });
    });
    it('should throw in case the date interval fields are not valid', async () => {
      const invalidUnit = {
        ...unitValid,
        openingHours: {
          custom: [
            {
              date: 'DATE',
              from: 'FROM',
              to: '25:71',
            },
          ],
        },
      };

      expect(isUnit(invalidUnit)).toEqual(false);
      await validateUnit(invalidUnit)
        .toPromise()
        .catch(error => {
          expect(error).toMatchInlineSnapshot(
            `"Unit Object Validation Error (JOI): \\"openingHours.custom[0].date\\" with value \\"DATE\\" fails to match the YYYY-MM-DD format pattern, \\"openingHours.custom[0].from\\" with value \\"FROM\\" fails to match the HH:MM format pattern, \\"openingHours.custom[0].to\\" with value \\"25:71\\" fails to match the HH:MM format pattern"`,
          );
        });
    });
    it('should recognize a valid custom opening hours', () => {
      const validUnit = {
        ...unitValid,
        openingHours: {
          custom: [
            {
              date: '2018-01-02',
              from: '09:01',
              to: '23:00',
            },
          ],
        },
      };

      expect(isUnit(validUnit)).toEqual(true);
    });
  });
});
