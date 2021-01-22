import { IContact } from './contact';
import { IFloorMapData } from './floor-map';
import { IGroup } from './group';
import { ILocalizedItem } from './localized-item';
import { IPaymentMode } from './payment';
import { IDailySchedule, IWeeklySchedule } from './weekly-schedule';

export interface IUnitSeat {
  user: string; // ???
  orders: string[]; // ???
}

export interface ILocation {
  lat: number;
  lng: number;
}

export interface ILane {
  _id?: string;
  name: string;
  color: string;
}

export interface IDetailedLane extends ILane {
  placedCount?: number;
  processingCount?: number;
  readyCount?: number;
}

export interface ILanesObject {
  [id: string]: ILane;
}

export interface IUnit extends IContact {
  _id: string;
  _group: IGroup;
  groupId: string;
  isActive: boolean;
  isAcceptingOrders: boolean;
  name: string;
  description: ILocalizedItem<string>;
  open: IDailySchedule;
  openingHours: IWeeklySchedule;
  lanes: ILanesObject;
  floorMap: IFloorMapData;
  paymentModes: IPaymentMode[];
}
