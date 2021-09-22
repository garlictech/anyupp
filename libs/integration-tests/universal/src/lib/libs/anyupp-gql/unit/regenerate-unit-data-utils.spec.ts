import {
  getProductComponentMap,
  getProductComponentSetMap,
  getTimezoneForUnit,
  listUnitProductsForAUnit,
} from '@bgap/anyupp-gql/backend';
import { createIamCrudSdk } from '../../../../api-clients';

const TEST_NAME = 'REGEN_UTILS';

describe('RegenerateUnitData Utils tests', () => {
  const iamCrudSdk = createIamCrudSdk();

  describe('getProductComponentSetMap function', () => {
    it('should still emit an empty object in case there is NO data in the DB', done => {
      getProductComponentSetMap({
        crudSdk: iamCrudSdk,
      })('NOT_EXISTING_CHAIN_ID').subscribe({
        next(result) {
          expect(result).toEqual({});
          done();
        },
        error(err) {
          console.error(`${TEST_NAME}Test ERROR`, err);
        },
      });
    }, 15000);
  });

  describe('getProductComponentMap function', () => {
    it('should still emit an empty object in case there is NO data in the DB', done => {
      getProductComponentMap({
        crudSdk: iamCrudSdk,
      })('NOT_EXISTING_CHAIN_ID').subscribe({
        next(result) {
          expect(result).toEqual({});
          done();
        },
        error(err) {
          console.error(`${TEST_NAME}Test ERROR`, err);
        },
      });
    }, 15000);
  });

  describe('listUnitProductsForAUnit function', () => {
    it('should throw in case there are NO unitProducts in the DB', done => {
      listUnitProductsForAUnit({
        crudSdk: iamCrudSdk,
      })('NOT_EXISTING_UNIT_ID').subscribe({
        next() {
          console.error(`${TEST_NAME}Test ERROR`, 'SHOULD NOT SUCCEED');
        },
        error(err) {
          expect(err).toMatchSnapshot();
          done();
        },
      });
    }, 15000);
  });

  describe('getTimezoneForUnit function', () => {
    it('should throw in case there are NO unit in the DB', done => {
      getTimezoneForUnit({
        crudSdk: iamCrudSdk,
      })('NOT_EXISTING_UNIT_ID').subscribe({
        next() {
          console.error(`${TEST_NAME}Test ERROR`, 'SHOULD NOT SUCCEED');
        },
        error(err) {
          expect(err).toMatchSnapshot();
          done();
        },
      });
    }, 15000);
  });
});
