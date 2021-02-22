/*
xdescribe('Units Reducer', () => {
  const createUnitsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as UnitsEntity);

  beforeEach(() => {});

  xdescribe('valid Units actions', () => {
    it('loadUnitsSuccess should return set the list of known Units', () => {
      const units = [
        createUnitsEntity('PRODUCT-AAA'),
        createUnitsEntity('PRODUCT-zzz'),
      ];
      const action = UnitsActions.loadUnitsSuccess({ units });

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