import { groupsAdapter, initialState } from './groups.reducer';
import * as GroupsSelectors from './groups.selectors';

describe('Groups Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getGroupsId = it => it['id'];
  const createGroupsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as GroupsEntity);

  let state;

  beforeEach(() => {
    state = {
      groups: groupsAdapter.setAll(
        [
          createGroupsEntity('PRODUCT-AAA'),
          createGroupsEntity('PRODUCT-BBB'),
          createGroupsEntity('PRODUCT-CCC'),
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

  describe('Groups Selectors', () => {
    it('getAllGroups() should return the list of Groups', () => {
      const results = GroupsSelectors.getAllGroups(state);
      const selId = getGroupsId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = GroupsSelectors.getSelected(state);
      const selId = getGroupsId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getGroupsLoaded() should return the current 'loaded' status", () => {
      const result = GroupsSelectors.getGroupsLoaded(state);

      expect(result).toBe(true);
    });

    it("getGroupsError() should return the current 'error' state", () => {
      const result = GroupsSelectors.getGroupsError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
