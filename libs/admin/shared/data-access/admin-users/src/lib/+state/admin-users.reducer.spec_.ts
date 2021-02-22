
/*
xdescribe('AdminUsers Reducer', () => {
  const createAdminUsersEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as AdminUsersEntity);

  beforeEach(() => {});

  xdescribe('valid AdminUsers actions', () => {
    it('loadAdminUsersSuccess should return set the list of known AdminUsers', () => {
      const adminUsers = [
        createAdminUsersEntity('PRODUCT-AAA'),
        createAdminUsersEntity('PRODUCT-zzz'),
      ];
      const action = AdminUsersActions.loadAdminUsersSuccess({ adminUsers });

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