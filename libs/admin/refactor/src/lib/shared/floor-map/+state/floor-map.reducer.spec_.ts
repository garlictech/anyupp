/*
xdescribe('FloorMap Reducer', () => {
  const createFloorMapEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as FloorMapEntity);

  beforeEach(() => {});

  xdescribe('valid FloorMap actions', () => {
    it('loadFloorMapSuccess should return set the list of known FloorMap', () => {
      const floorMap = [
        createFloorMapEntity('PRODUCT-AAA'),
        createFloorMapEntity('PRODUCT-zzz'),
      ];
      const action = FloorMapActions.loadFloorMapSuccess({ floorMap });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  xdescribe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
*/
