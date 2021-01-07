import { IGroup } from 'src/app/shared/interfaces';

import { createAction, props } from '@ngrx/store';

export const resetGroups = createAction('[GroupList] Reset groups');
export const setAllGroups = createAction(
  '[GroupList] Set all groups',
  props<{ groups: IGroup[] }>()
);
