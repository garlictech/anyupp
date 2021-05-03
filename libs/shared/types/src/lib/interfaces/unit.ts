import { IAddressInfo } from './address';
import { IContact } from './contact';
import { IFloorMapData } from './floor-map';
import { IGroup } from './group';
import { ILocalizedItem } from './localized-item';
import { IDateIntervals } from './order';
import { IPaymentMode } from './payment';
import { IWeeklySchedule } from './weekly-schedule';

export interface IUnitSeat {
  user: string; // ???
  orders: string[]; // ???
}

export interface ILane {
  __typename?: 'Lane';
  id?: string;
  name: string;
  color: string;
}

export interface IDetailedLane extends ILane {
  placedCount?: number;
  processingCount?: number;
  readyCount?: number;
}

export interface IUnit extends IContact, IAddressInfo {
  __typename?: 'Unit';
  _group?: IGroup;
  id: string;
  groupId: string;
  chainId: string;
  isActive: boolean;
  isAcceptingOrders: boolean;
  name: string;
  description?: ILocalizedItem<string>;
  open?: IDateIntervals;
  openingHours?: IWeeklySchedule;
  lanes?: [ILane];
  floorMap?: IFloorMapData;
  paymentModes?: IPaymentMode[];
  merchantId?: string;
  createdAt: string;
  updatedAt: string;
}
