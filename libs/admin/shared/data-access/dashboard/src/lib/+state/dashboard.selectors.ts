import { ordersSelectors } from '@bgap/admin/shared/data-access/orders';
import {
  EDashboardListMode,
  EDashboardSize,
  EDashboardTicketListType,
} from '@bgap/shared/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  DASHBOARD_FEATURE_KEY,
  DashboardState,
  DashboardSettings,
} from './dashboard.reducer';
import * as CrudApi from '@bgap/crud-gql/api';

export const getDashboardState = createFeatureSelector<DashboardState>(
  DASHBOARD_FEATURE_KEY,
);

export const getSelectedActiveOrder = () => {
  return createSelector(
    getSelectedOrderId,
    ordersSelectors.getAllActiveOrders,
    (
      selectedOrderId: string | undefined,
      activeOrders: CrudApi.Order[],
    ): CrudApi.Order | undefined => {
      return activeOrders.find(
        (order): boolean => order.id === selectedOrderId,
      );
    },
  );
};

export const getSelectedHistoryOrder = () => {
  return createSelector(
    getSelectedOrderId,
    ordersSelectors.getAllHistoryOrders,
    (
      selectedOrderId: string | undefined,
      historyOrders: CrudApi.Order[],
    ): CrudApi.Order | undefined => {
      return historyOrders?.find(
        (order): boolean => order.id === selectedOrderId,
      );
    },
  );
};

export const getSettings = createSelector(
  getDashboardState,
  (state: DashboardState): DashboardSettings => state.settings,
);

export const getSelectedOrderId = createSelector(
  getDashboardState,
  (state: DashboardState): string | undefined => state.selectedOrderId,
);

export const getListMode = createSelector(
  getDashboardState,
  (state: DashboardState): EDashboardListMode => state.settings.listMode,
);

export const getTicketListType = createSelector(
  getDashboardState,
  (state: DashboardState): EDashboardTicketListType =>
    state.settings.ticketListType,
);

export const getSize = createSelector(
  getDashboardState,
  (state: DashboardState): EDashboardSize => state.settings.size,
);

export const getSelectedLanes = createSelector(
  getDashboardState,
  (state: DashboardState): string[] => state.settings.selectedLanes,
);

export const getSelectedHistoryDate = createSelector(
  getDashboardState,
  (state: DashboardState): number => state.settings.historyDate,
);
