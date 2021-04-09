import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as RoleContextsActions from './role-contexts.actions';

import { IRoleContext } from '@bgap/shared/types';

export const ROLE_CONTEXTS_FEATURE_KEY = 'roleContexts';

export interface IRoleContextsState extends EntityState<IRoleContext> {
  error?: string | null; // last known error (if any)
}

export interface RoleContextsPartialState {
  readonly [ROLE_CONTEXTS_FEATURE_KEY]: IRoleContextsState;
}

export const roleContextsAdapter: EntityAdapter<IRoleContext> = createEntityAdapter<
  IRoleContext
>();

export const initialState: IRoleContextsState = roleContextsAdapter.getInitialState(
  {},
);

const reducer = createReducer(
  initialState,
  on(RoleContextsActions.init, state => ({
    ...state,

    error: null,
  })),
  on(RoleContextsActions.upsertRoleContext, (state, { roleContext }) =>
    roleContextsAdapter.upsertOne(roleContext, state),
  ),
  on(RoleContextsActions.resetRoleContexts, state =>
    roleContextsAdapter.removeAll(state),
  ),
);

export function roleContextsReducer(
  state: IRoleContextsState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
