import { IRoleContext } from 'libs/shared/types/src';

import { createAction, props } from '@ngrx/store';

export const init = createAction('[RoleContexts Page] Init');

export const upsertRoleContext = createAction(
  '[RoleContexts] Upsert role context',
  props<{ roleContext: IRoleContext }>(),
);

export const resetRoleContexts = createAction('[RoleContexts] Reset role contexts');
