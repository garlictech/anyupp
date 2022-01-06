/*
xdescribe('LoggedUser Reducer', () => {
  const createLoggedUserEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as LoggedUserEntity);

  beforeEach(() => {});

  xdescribe('valid LoggedUser actions', () => {
    it('loadLoggedUserSuccess should return set the list of known LoggedUser', () => {
      const loggedUser = [
        createLoggedUserEntity('PRODUCT-AAA'),
        createLoggedUserEntity('PRODUCT-zzz'),
      ];
      const action = LoggedUserActions.loadLoggedUserSuccess({ loggedUser });

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
