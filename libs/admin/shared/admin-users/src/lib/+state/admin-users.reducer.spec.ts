import * as AdminUsersActions from './admin-users.actions';
import { State, initialState, reducer } from './admin-users.reducer';

describe('AdminUsers Reducer', () => {
  const createAdminUsersEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as AdminUsersEntity);

  beforeEach(() => {});

  describe('valid AdminUsers actions', () => {
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

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
