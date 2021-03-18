/*
xdescribe('Dashboard Reducer', () => {
  const createDashboardEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as DashboardEntity);

  beforeEach(() => {});

  xdescribe('valid Dashboard actions', () => {
    it('loadDashboardSuccess should return set the list of known Dashboard', () => {
      const dashboard = [
        createDashboardEntity('PRODUCT-AAA'),
        createDashboardEntity('PRODUCT-zzz'),
      ];
      const action = DashboardActions.loadDashboardSuccess({ dashboard });

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
