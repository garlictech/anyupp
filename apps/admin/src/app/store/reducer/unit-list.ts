import { IUnit } from 'src/app/shared/interfaces';

import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  ActionReducer,
  ActionReducerMap,
  combineReducers,
  createReducer,
  on,
} from '@ngrx/store';

import { unitListActions } from '../actions';
import { IUnitListState } from '../state';

export const unitListAdapter: EntityAdapter<IUnit> = createEntityAdapter<IUnit>(
  {
    selectId: (item: IUnit): string => item._id,
  }
);
export const unitListInitialState: EntityState<IUnit> = unitListAdapter.getInitialState();

const baseUnitListReducer = createReducer(
  unitListInitialState,
  on(
    unitListActions.setAllUnits,
    (state, { units }): EntityState<IUnit> =>
      unitListAdapter.setAll(units, state)
  ),
  on(
    unitListActions.resetUnits,
    (state): EntityState<IUnit> => unitListAdapter.removeAll(state)
  )
);

const reducerMap: ActionReducerMap<IUnitListState> = {
  units: baseUnitListReducer,
};

const reducer: ActionReducer<IUnitListState> = combineReducers(reducerMap);

export function unitListReducer(state: any, action: any): IUnitListState {
  return reducer(state, action);
}
