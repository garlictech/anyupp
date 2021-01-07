import {
  EDashboardListMode,
  EDashboardSize,
  EDashboardTicketListType,
} from 'src/app/shared/enums';

import { Action, createReducer, on } from '@ngrx/store';

import { dashboardActions } from '../actions';
import { IDashboardState } from '../state';

export const initialDashboardState: IDashboardState = {
  settings: {
    listMode: EDashboardListMode.CURRENT,
    size: EDashboardSize.NORMAL,
    orderEditing: false,
    showAllUserOrders: false,
    ticketListType: EDashboardTicketListType.PLACED,
    selectedLanes: ['default'],
  },
};

const reducer = createReducer(
  initialDashboardState,
  on(dashboardActions.resetDashboard, (): any => ({
    ...initialDashboardState,
  })),
  on(dashboardActions.setSelectedOrderId, (state, { orderId }): any => ({
    ...state,
    selectedOrderId: orderId,
  })),
  on(dashboardActions.resetSelectedOrderId, (state, {}): any => ({
    ...state,
    selectedOrderId: undefined,
  })),
  on(dashboardActions.setListMode, (state, { listMode }): any => ({
    ...state,
    settings: {
      ...state.settings,
      listMode,
    },
  })),
  on(dashboardActions.setSize, (state, { size }): any => ({
    ...state,
    settings: {
      ...state.settings,
      size,
    },
  })),
  on(dashboardActions.setOrderEditing, (state, { orderEditing }): any => ({
    ...state,
    settings: {
      ...state.settings,
      orderEditing,
    },
  })),
  on(
    dashboardActions.setShowAllUserOrders,
    (state, { showAllUserOrders }): any => ({
      ...state,
      settings: {
        ...state.settings,
        showAllUserOrders,
      },
    })
  ),
  on(dashboardActions.setTicketListType, (state, { ticketListType }): any => ({
    ...state,
    settings: {
      ...state.settings,
      ticketListType,
    },
  })),
  on(dashboardActions.setSelectedLanes, (state, { selectedLanes }): any => ({
    ...state,
    settings: {
      ...state.settings,
      selectedLanes,
    },
  }))
);

export function dashboardReducer(
  state: IDashboardState | undefined,
  action: Action
): any {
  return reducer(state, action);
}
