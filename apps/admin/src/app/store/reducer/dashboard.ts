import {
  EDashboardListMode,
  EDashboardSize,
  EDashboardTicketListType,
} from '@bgap/shared/types';

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
    historyDate: new Date().getTime(),
  },
};

const reducer = createReducer(
  initialDashboardState,
  on(dashboardActions.resetDashboard, () => ({
    ...initialDashboardState,
  })),
  on(dashboardActions.setSelectedOrderId, (state, { orderId }) => ({
    ...state,
    selectedOrderId: orderId,
  })),
  on(dashboardActions.resetSelectedOrderId, state => ({
    ...state,
    selectedOrderId: undefined,
  })),
  on(dashboardActions.setListMode, (state, { listMode }) => ({
    ...state,
    settings: {
      ...state.settings,
      listMode,
    },
  })),
  on(dashboardActions.setSize, (state, { size }) => ({
    ...state,
    settings: {
      ...state.settings,
      size,
    },
  })),
  on(dashboardActions.setOrderEditing, (state, { orderEditing }) => ({
    ...state,
    settings: {
      ...state.settings,
      orderEditing,
    },
  })),
  on(dashboardActions.setShowAllUserOrders, (state, { showAllUserOrders }) => ({
    ...state,
    settings: {
      ...state.settings,
      showAllUserOrders,
    },
  })),
  on(dashboardActions.setTicketListType, (state, { ticketListType }) => ({
    ...state,
    settings: {
      ...state.settings,
      ticketListType,
    },
  })),
  on(dashboardActions.setSelectedLanes, (state, { selectedLanes }) => ({
    ...state,
    settings: {
      ...state.settings,
      selectedLanes,
    },
  })),
  on(dashboardActions.setHistoryDate, (state, { historyDate }) => ({
    ...state,
    settings: {
      ...state.settings,
      historyDate,
    },
  }))
);

export function dashboardReducer(
  state: IDashboardState | undefined,
  action: Action
) {
  return reducer(state, action);
}
