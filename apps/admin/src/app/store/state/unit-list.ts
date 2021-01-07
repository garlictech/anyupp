import { IUnit } from '../../shared/interfaces';

import { EntityState } from '@ngrx/entity';

export type IUnitEntityState = EntityState<IUnit>;

export interface IUnitListState {
  units: IUnitEntityState;
}
