import { getAllActiveOrders, getAllHistoryOrders } from 'libs/admin/shared/data-access/orders/src/lib/+state/orders.selectors';

import {
  EDashboardListMode,
  EDashboardSize,
  EDashboardTicketListType,
  IOrder,
} from '@bgap/shared/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  DASHBOARD_FEATURE_KEY,
  DashboardState,
  IDashboardSettings,
} from './dashboard.reducer';

// Lookup the 'Dashboard' feature state managed by NgRx
export const getDashboardState = createFeatureSelector<DashboardState>(
  DASHBOARD_FEATURE_KEY
);

export const getSelectedActiveOrder = () => {
  return createSelector(
    getSelectedOrderId,
    getAllActiveOrders,
    (selectedOrderId: string | undefined, activeOrders: IOrder[]): IOrder | undefined => {
      return activeOrders.find(
        (order): boolean => order._id === selectedOrderId
      );
    }
  );
};

export const getSelectedHistoryOrder = () => {
  return createSelector(
    getSelectedOrderId,
    getAllHistoryOrders,
    (selectedOrderId: string | undefined, historyOrders: IOrder[]): IOrder | undefined => {
      return historyOrders?.find(
        (order): boolean => order._id === selectedOrderId
      );
    }
  );
};

export const getSettings = createSelector(
  getDashboardState,
  (state: DashboardState): IDashboardSettings => state.settings
);

export const getSelectedOrderId = createSelector(
  getDashboardState,
  (state: DashboardState): string | undefined => state.selectedOrderId
);

export const getListMode = createSelector(
  getDashboardState,
  (state: DashboardState): EDashboardListMode => state.settings.listMode
);

export const getTicketListType = createSelector(
  getDashboardState,
  (state: DashboardState): EDashboardTicketListType =>
    state.settings.ticketListType
);

export const getSize = createSelector(
  getDashboardState,
  (state: DashboardState): EDashboardSize => state.settings.size
);

export const getSelectedLanes = createSelector(
  getDashboardState,
  (state: DashboardState): string[] => state.settings.selectedLanes
);

export const getSelectedHistoryDate = createSelector(
  getDashboardState,
  (state: DashboardState): number => state.settings.historyDate
);
