import { createAction, props } from '@ngrx/store';
import { IGroup } from '@bgap/shared/types';

export const init = createAction('[Groups Page] Init');

export const upsertGroup = createAction(
  '[Groups] Upsert Group',
  props<{ group: IGroup }>(),
);

export const resetGroups = createAction('[GroupList] Reset groups');
