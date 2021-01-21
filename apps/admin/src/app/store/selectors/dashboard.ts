import {
  EDashboardListMode,
  EDashboardSize,
  EDashboardTicketListType,
} from '@bgap/shared/types/enums';
import { IOrder } from '@bgap/shared/types/interfaces';

import {
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

import { IDashboardSettings, IDashboardState } from '../state';
import { getAllActiveOrders, getAllHistoryOrders } from './order-list';

const featureSelector = createFeatureSelector<IDashboardState>('dashboard');

export const getSelectedActiveOrder = () => {
  return createSelector(
    getSelectedOrderId,
    getAllActiveOrders,
    (selectedOrderId: string, activeOrders: IOrder[]): IOrder => {
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
    (selectedOrderId: string, historyOrders: IOrder[]): IOrder => {
      return historyOrders.find(
        (order): boolean => order._id === selectedOrderId
      );
    }
  );
};

export const getSettings = createSelector(
  featureSelector,
  (state: IDashboardState): IDashboardSettings => state.settings
);

export const getSelectedOrderId = createSelector(
  featureSelector,
  (state: IDashboardState): string => state.selectedOrderId
);

export const getListMode = createSelector(
  featureSelector,
  (state: IDashboardState): EDashboardListMode => state.settings.listMode
);

export const getTicketListType = createSelector(
  featureSelector,
  (state: IDashboardState): EDashboardTicketListType =>
    state.settings.ticketListType
);

export const getSize = createSelector(
  featureSelector,
  (state: IDashboardState): EDashboardSize => state.settings.size
);

export const getSelectedLanes = createSelector(
  featureSelector,
  (state: IDashboardState): string[] => state.settings.selectedLanes
);

export const getSelectedHistoryDate = createSelector(
  featureSelector,
  (state: IDashboardState): number => state.settings.historyDate
);
