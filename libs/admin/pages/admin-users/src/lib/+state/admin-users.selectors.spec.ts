import { AdminUsersEntity } from './admin-users.models';
import { State, adminUsersAdapter, initialState } from './admin-users.reducer';
import * as AdminUsersSelectors from './admin-users.selectors';

describe('AdminUsers Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getAdminUsersId = it => it['id'];
  const createAdminUsersEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as AdminUsersEntity);

  let state;

  beforeEach(() => {
    state = {
      adminUsers: adminUsersAdapter.setAll(
        [
          createAdminUsersEntity('PRODUCT-AAA'),
          createAdminUsersEntity('PRODUCT-BBB'),
          createAdminUsersEntity('PRODUCT-CCC'),
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

  describe('AdminUsers Selectors', () => {
    it('getAllAdminUsers() should return the list of AdminUsers', () => {
      const results = AdminUsersSelectors.getAllAdminUsers(state);
      const selId = getAdminUsersId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = AdminUsersSelectors.getSelected(state);
      const selId = getAdminUsersId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getAdminUsersLoaded() should return the current 'loaded' status", () => {
      const result = AdminUsersSelectors.getAdminUsersLoaded(state);

      expect(result).toBe(true);
    });

    it("getAdminUsersError() should return the current 'error' state", () => {
      const result = AdminUsersSelectors.getAdminUsersError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
