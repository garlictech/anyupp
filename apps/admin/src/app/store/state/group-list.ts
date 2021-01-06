import { IGroup } from 'src/app/shared/interfaces';

import { EntityState } from '@ngrx/entity';

export interface IGroupEntityState extends EntityState<IGroup> {}

export interface IGroupListState {
  groups: IGroupEntityState;
}
