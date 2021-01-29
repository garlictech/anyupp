import { createAction, props } from '@ngrx/store';
import { IGroup } from '@bgap/shared/types';

export const init = createAction('[Groups Page] Init');

export const loadGroupsSuccess = createAction(
  '[Groups] Load Groups Success',
  props<{ groups: IGroup[] }>()
);

export const loadGroupsFailure = createAction(
  '[Groups] Load Groups Failure',
  props<{ error: any }>()
);

export const resetGroups = createAction('[GroupList] Reset groups');
