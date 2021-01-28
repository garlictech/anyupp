import { createAction, props } from '@ngrx/store';
import { IGroup } from '@bgap/shared/types';

export const resetGroups = createAction('[GroupList] Reset groups');
export const setAllGroups = createAction(
  '[GroupList] Set all groups',
  props<{ groups: IGroup[] }>()
);
