import { IUnit } from '@bgap/shared/types';

import { EntityState } from '@ngrx/entity';

export type IUnitEntityState = EntityState<IUnit>;

export interface IUnitListState {
  units: IUnitEntityState;
}
