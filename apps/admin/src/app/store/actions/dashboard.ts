import { createAction, props } from '@ngrx/store';
import {
  EDashboardListMode,
  EDashboardSize,
  EDashboardTicketListType,
} from 'src/app/shared/enums';

export const resetDashboard = createAction('[Dashboard] Reset dashboard');
export const setSelectedOrderId = createAction(
  '[Dashboard] Set selected orderId',
  props<{ orderId: string }>()
);
export const resetSelectedOrderId = createAction(
  '[Dashboard] Reset selected orderId'
);
export const setListMode = createAction(
  '[Dashboard] Set list mode',
  props<{ listMode: EDashboardListMode }>()
);
export const setSize = createAction(
  '[Dashboard] Set size',
  props<{ size: EDashboardSize }>()
);
export const setOrderEditing = createAction(
  '[Dashboard] Set order editing',
  props<{ orderEditing: boolean }>()
);
export const setShowAllUserOrders = createAction(
  '[Dashboard] Set show all user orders',
  props<{ showAllUserOrders: boolean }>()
);
export const setTicketListType = createAction(
  '[Dashboard] Set ticket list type',
  props<{ ticketListType: EDashboardTicketListType }>()
);
export const setSelectedLanes = createAction(
  '[Dashboard] Set selected lanes',
  props<{ selectedLanes: string[] }>()
);
