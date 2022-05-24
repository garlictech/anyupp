import { floorMapAdapter, initialState } from './floor-map.reducer';
import * as FloorMapSelectors from './floor-map.selectors';

xdescribe('FloorMap Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getFloorMapId = it => it['id'];
  const createFloorMapEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as FloorMapEntity);

  let state;

  beforeEach(() => {
    state = {
      floorMap: floorMapAdapter.setAll(
        [
          createFloorMapEntity('PRODUCT-AAA'),
          createFloorMapEntity('PRODUCT-BBB'),
          createFloorMapEntity('PRODUCT-CCC'),
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

  xdescribe('FloorMap Selectors', () => {
    it('getAllFloorMap() should return the list of FloorMap', () => {
      const results = FloorMapSelectors.getAllFloorMap(state);
      const selId = getFloorMapId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = FloorMapSelectors.getSelected(state);
      const selId = getFloorMapId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getFloorMapLoaded() should return the current 'loaded' status", () => {
      const result = FloorMapSelectors.getFloorMapLoaded(state);

      expect(result).toBe(true);
    });

    it("getFloorMapError() should return the current 'error' state", () => {
      const result = FloorMapSelectors.getFloorMapError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
