import { createAction, props } from '@ngrx/store';
import {
  EDashboardListMode,
  EDashboardSize,
  EDashboardTicketListType,
} from '@bgap/shared/types';

export const resetDashboard = createAction('[Dashboard] Reset dashboard');
export const setSelectedOrderId = createAction(
  '[Dashboard] Set selected orderId',
  props<{ orderId: string | undefined }>(),
);
export const resetSelectedOrderId = createAction(
  '[Dashboard] Reset selected orderId',
);
export const setListMode = createAction(
  '[Dashboard] Set list mode',
  props<{ listMode: EDashboardListMode }>(),
);
export const setSize = createAction(
  '[Dashboard] Set size',
  props<{ size: EDashboardSize }>(),
);
export const setOrderEditing = createAction(
  '[Dashboard] Set order editing',
  props<{ orderEditing: boolean }>(),
);
export const setShowAllUserOrders = createAction(
  '[Dashboard] Set show all user orders',
  props<{ showAllUserOrders: boolean }>(),
);
export const setTicketListType = createAction(
  '[Dashboard] Set ticket list type',
  props<{ ticketListType: EDashboardTicketListType }>(),
);
export const setSelectedLanes = createAction(
  '[Dashboard] Set selected lanes',
  props<{ selectedLanes: string[] }>(),
);
export const setHistoryDate = createAction(
  '[Dashboard] Set history date',
  props<{ historyDate: number }>(),
);
export const updateSelectedUnitOrderHistory = createAction(
  '[Dashboard] Update selected unit order history',
  props<{ historyDate: number | string }>(),
);
