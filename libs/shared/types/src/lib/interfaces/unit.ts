import * as Joi from 'joi';

import { validateSchema } from '../validation/validate';
import { IAddressInfo } from './address';
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

export interface ILane {
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
  isActive?: boolean;
  isAcceptingOrders?: boolean;
  name?: string;
  description?: ILocalizedItem<string>;
  open?: IDailySchedule;
  openingHours?: IWeeklySchedule;
  lanes?: [ILane];
  floorMap?: IFloorMapData;
  paymentModes?: IPaymentMode[];
  createdAt: string;
  updatedAt: string;
}

export const unitSchema: Joi.SchemaMap<IUnit> = {
  __typename: Joi.string().valid('Unit').optional(),
  id: Joi.string().required(),
  groupId: Joi.string().required(),
  chainId: Joi.string().required(),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
};

export const { validate: validateUnit, isType: isUnit } = validateSchema<IUnit>(
  unitSchema,
  'Unit',
);
