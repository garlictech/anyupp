import { createAction, props } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

export const init = createAction('[RoleContexts] Init');

export const upsertRoleContexts = createAction(
  '[RoleContexts] Upsert role contexts',
  props<{ roleContexts: CrudApi.RoleContext[] }>(),
);

export const resetRoleContexts = createAction(
  '[RoleContexts] Reset role contexts',
);
