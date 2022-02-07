/*
import { AppCoreEntity } from './app-core.models';
import * as AppCoreActions from './app-core.actions';
import { State, initialState, reducer } from './app-core.reducer';

describe('AppCore Reducer', () => {
  const createAppCoreEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as AppCoreEntity);

  beforeEach(() => {});

  describe('valid AppCore actions', () => {
    it('loadAppCoreSuccess should return set the list of known AppCore', () => {
      const appCore = [
        createAppCoreEntity('PRODUCT-AAA'),
        createAppCoreEntity('PRODUCT-zzz'),
      ];
      const action = AppCoreActions.loadAppCoreSuccess({ appCore });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
*/
