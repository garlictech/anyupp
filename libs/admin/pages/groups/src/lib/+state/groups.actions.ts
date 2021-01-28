import { createAction, props } from '@ngrx/store';
import { GroupsEntity } from './groups.models';

export const init = createAction('[Groups Page] Init');

export const loadGroupsSuccess = createAction(
  '[Groups/API] Load Groups Success',
  props<{ groups: GroupsEntity[] }>()
);

export const loadGroupsFailure = createAction(
  '[Groups/API] Load Groups Failure',
  props<{ error: any }>()
);
