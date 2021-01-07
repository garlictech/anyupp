import { EntityState } from '@ngrx/entity';
import { IGroup } from '../../shared/interfaces';

export type IGroupEntityState = EntityState<IGroup>;

export interface IGroupListState {
  groups: IGroupEntityState;
}
