import { IUnit } from 'src/app/shared/interfaces';

import { EntityState } from '@ngrx/entity';

export interface IUnitEntityState extends EntityState<IUnit> {}

export interface IUnitListState {
  units: IUnitEntityState;
}
