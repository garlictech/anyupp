import { chainsAdapter, initialState } from './chains.reducer';
import * as ChainsSelectors from './chains.selectors';

describe('Chains Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getChainsId = it => it['id'];
  const createChainsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as ChainsEntity);

  let state;

  beforeEach(() => {
    state = {
      chains: chainsAdapter.setAll(
        [
          createChainsEntity('PRODUCT-AAA'),
          createChainsEntity('PRODUCT-BBB'),
          createChainsEntity('PRODUCT-CCC'),
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

  describe('Chains Selectors', () => {
    it('getAllChains() should return the list of Chains', () => {
      const results = ChainsSelectors.getAllChains(state);
      const selId = getChainsId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = ChainsSelectors.getSelected(state);
      const selId = getChainsId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getChainsLoaded() should return the current 'loaded' status", () => {
      const result = ChainsSelectors.getChainsLoaded(state);

      expect(result).toBe(true);
    });

    it("getChainsError() should return the current 'error' state", () => {
      const result = ChainsSelectors.getChainsError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
