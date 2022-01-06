/*
import { AppCoreEntity } from './app-core.models';
import { State, appCoreAdapter, initialState } from './app-core.reducer';
import * as AppCoreSelectors from './app-core.selectors';

describe('AppCore Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getAppCoreId = it => it['id'];
  const createAppCoreEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as AppCoreEntity);

  let state;

  beforeEach(() => {
    state = {
      appCore: appCoreAdapter.setAll(
        [
          createAppCoreEntity('PRODUCT-AAA'),
          createAppCoreEntity('PRODUCT-BBB'),
          createAppCoreEntity('PRODUCT-CCC'),
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        },
      ),
    };
  });

  describe('AppCore Selectors', () => {
    it('getAllAppCore() should return the list of AppCore', () => {
      const results = AppCoreSelectors.getAllAppCore(state);
      const selId = getAppCoreId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = AppCoreSelectors.getSelected(state);
      const selId = getAppCoreId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getAppCoreLoaded() should return the current 'loaded' status", () => {
      const result = AppCoreSelectors.getAppCoreLoaded(state);

      expect(result).toBe(true);
    });

    it("getAppCoreError() should return the current 'error' state", () => {
      const result = AppCoreSelectors.getAppCoreError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
*/
