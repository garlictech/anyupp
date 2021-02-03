import { unitsAdapter, initialState } from './units.reducer';
import * as UnitsSelectors from './units.selectors';

describe('Units Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getUnitsId = it => it['id'];
  const createUnitsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as UnitsEntity);

  let state;

  beforeEach(() => {
    state = {
      units: unitsAdapter.setAll(
        [
          createUnitsEntity('PRODUCT-AAA'),
          createUnitsEntity('PRODUCT-BBB'),
          createUnitsEntity('PRODUCT-CCC'),
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('Units Selectors', () => {
    it('getAllUnits() should return the list of Units', () => {
      const results = UnitsSelectors.getAllUnits(state);
      const selId = getUnitsId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = UnitsSelectors.getSelected(state);
      const selId = getUnitsId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getUnitsLoaded() should return the current 'loaded' status", () => {
      const result = UnitsSelectors.getUnitsLoaded(state);

      expect(result).toBe(true);
    });

    it("getUnitsError() should return the current 'error' state", () => {
      const result = UnitsSelectors.getUnitsError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
