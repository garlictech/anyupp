import {
  EDashboardListMode,
  EDashboardSize,
  EDashboardTicketListType,
} from '@bgap/shared/types';
import { Action, createReducer, on } from '@ngrx/store';

import * as DashboardActions from './dashboard.actions';

export const DASHBOARD_FEATURE_KEY = 'dashboard';

export interface DashboardSettings {
  listMode: EDashboardListMode;
  size: EDashboardSize;
  orderEditing: boolean;
  showAllUserOrders: boolean;
  ticketListType: EDashboardTicketListType;
  selectedLanes: string[];
  historyDate: number;
}

export interface DashboardState {
  selectedOrderId?: string;
  settings: DashboardSettings;
}

export const initialDashboardState: DashboardState = {
  settings: {
    listMode: EDashboardListMode.current,
    size: EDashboardSize.NORMAL,
    orderEditing: false,
    showAllUserOrders: false,
    ticketListType: EDashboardTicketListType.placed,
    selectedLanes: ['default'],
    historyDate: new Date().getTime(),
  },
};

const reducer = createReducer(
  initialDashboardState,
  on(DashboardActions.resetDashboard, () => ({
    ...initialDashboardState,
  })),
  on(DashboardActions.setSelectedOrderId, (state, { orderId }) => ({
    ...state,
    selectedOrderId: orderId,
  })),
  on(DashboardActions.resetSelectedOrderId, state => ({
    ...state,
    selectedOrderId: undefined,
  })),
  on(DashboardActions.setListMode, (state, { listMode }) => ({
    ...state,
    settings: {
      ...state.settings,
      listMode,
    },
  })),
  on(DashboardActions.setSize, (state, { size }) => ({
    ...state,
    settings: {
      ...state.settings,
      size,
    },
  })),
  on(DashboardActions.setOrderEditing, (state, { orderEditing }) => ({
    ...state,
    settings: {
      ...state.settings,
      orderEditing,
    },
  })),
  on(DashboardActions.setShowAllUserOrders, (state, { showAllUserOrders }) => ({
    ...state,
    settings: {
      ...state.settings,
      showAllUserOrders,
    },
  })),
  on(DashboardActions.setTicketListType, (state, { ticketListType }) => ({
    ...state,
    settings: {
      ...state.settings,
      ticketListType,
    },
  })),
  on(DashboardActions.setSelectedLanes, (state, { selectedLanes }) => ({
    ...state,
    settings: {
      ...state.settings,
      selectedLanes,
    },
  })),
  on(DashboardActions.setHistoryDate, (state, { historyDate }) => ({
    ...state,
    settings: {
      ...state.settings,
      historyDate,
    },
  })),
);

export function dashboardReducer(
  state: DashboardState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
