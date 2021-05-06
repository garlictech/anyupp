import { createAction, props } from '@ngrx/store';
import { IGroup } from '@bgap/shared/types';

export const init = createAction('[Groups] Init');

export const upsertGroup = createAction(
  '[Groups] Upsert group',
  props<{ group: IGroup }>(),
);

export const resetGroups = createAction('[Groups] Reset groups');
