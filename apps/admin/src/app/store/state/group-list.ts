import { IGroup } from 'src/app/shared/interfaces';

import { EntityState } from '@ngrx/entity';

export type IGroupEntityState = EntityState<IGroup>

export interface IGroupListState {
  groups: IGroupEntityState;
}
