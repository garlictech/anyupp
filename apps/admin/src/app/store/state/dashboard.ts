import {
  EDashboardListMode,
  EDashboardSize,
  EDashboardTicketListType,
} from '@bgap/shared/types';

export interface IDashboardSettings {
  listMode: EDashboardListMode;
  size: EDashboardSize;
  orderEditing: boolean;
  showAllUserOrders: boolean;
  ticketListType: EDashboardTicketListType;
  selectedLanes: string[];
  historyDate: number;
}

export interface IDashboardState {
  selectedOrderId?: string;
  settings: IDashboardSettings;
}
