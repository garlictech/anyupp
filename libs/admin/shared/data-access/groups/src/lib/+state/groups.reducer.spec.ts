/*
describe('Groups Reducer', () => {
  const createGroupsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as GroupsEntity);

  beforeEach(() => {});

  describe('valid Groups actions', () => {
    it('loadGroupsSuccess should return set the list of known Groups', () => {
      const groups = [
        createGroupsEntity('PRODUCT-AAA'),
        createGroupsEntity('PRODUCT-zzz'),
      ];
      const action = GroupsActions.loadGroupsSuccess({ groups });

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