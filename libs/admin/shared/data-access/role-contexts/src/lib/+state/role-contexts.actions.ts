import { IRoleContext } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[RoleContexts] Init');

export const upsertRoleContext = createAction(
  '[RoleContexts] Upsert role context',
  props<{ roleContext: IRoleContext }>(),
);

export const resetRoleContexts = createAction(
  '[RoleContexts] Reset role contexts',
);
