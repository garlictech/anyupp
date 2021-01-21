import { EntityState } from '@ngrx/entity';
import { IGroup } from '@bgap/shared/types/interfaces';

export type IGroupEntityState = EntityState<IGroup>;

export interface IGroupListState {
  groups: IGroupEntityState;
}
