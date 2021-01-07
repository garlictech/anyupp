import { IUnit } from 'src/app/shared/interfaces';

import { EntityState } from '@ngrx/entity';

export type IUnitEntityState = EntityState<IUnit>

export interface IUnitListState {
  units: IUnitEntityState;
}
