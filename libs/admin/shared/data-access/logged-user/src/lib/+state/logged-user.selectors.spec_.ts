/*
import { LoggedUserEntity } from './logged-user.models';
import { loggedUserAdapter, initialState } from './logged-user.reducer';
import * as LoggedUserSelectors from './logged-user.selectors';

xdescribe('LoggedUser Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getLoggedUserId = it => it['id'];
  const createLoggedUserEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as LoggedUserEntity);

  let state;

  beforeEach(() => {
    state = {
      loggedUser: loggedUserAdapter.setAll(
        [
          createLoggedUserEntity('PRODUCT-AAA'),
          createLoggedUserEntity('PRODUCT-BBB'),
          createLoggedUserEntity('PRODUCT-CCC'),
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

  xdescribe('LoggedUser Selectors', () => {
    it('getAllLoggedUser() should return the list of LoggedUser', () => {
      const results = LoggedUserSelectors.getAllLoggedUser(state);
      const selId = getLoggedUserId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = LoggedUserSelectors.getSelected(state);
      const selId = getLoggedUserId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getLoggedUserLoaded() should return the current 'loaded' status", () => {
      const result = LoggedUserSelectors.getLoggedUserLoaded(state);

      expect(result).toBe(true);
    });

    it("getLoggedUserError() should return the current 'error' state", () => {
      const result = LoggedUserSelectors.getLoggedUserError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
*/
