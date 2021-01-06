import { EDashboardListMode, EDashboardSize, EDashboardTicketListType } from 'src/app/shared/enums';

export interface IDashboardSettings {
  listMode: EDashboardListMode;
  size: EDashboardSize;
  orderEditing: boolean;
  showAllUserOrders: boolean;
  ticketListType: EDashboardTicketListType;
  selectedLanes: string[];
}

export interface IDashboardState {
  selectedOrderId?: string;
  settings: IDashboardSettings;
}
