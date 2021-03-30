import * as Joi from 'joi';

import { validateSchema } from '../validation/validate';
import { addressInfoSchema, IAddressInfo } from './address';
import { contactSchema, IContact } from './contact';
import { floorMapSchema, IFloorMapData } from './floor-map';
import { IGroup } from './group';
import { ILocalizedItem, localizedItemSchema } from './localized-item';
import { IDateIntervals } from './order';
import { IPaymentMode, paymentModeSchema } from './payment';
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
export const laneSchema: Joi.SchemaMap<ILane> = {
  __typename: Joi.string().valid('Lane').optional(),
  id: Joi.string().allow(null),
  name: Joi.string().required(),
  color: Joi.string().required(),
};
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
  createdAt: string;
  updatedAt: string;
}

export const unitSchema: Joi.SchemaMap<IUnit> = {
  __typename: Joi.string().valid('Unit').optional(),
  id: Joi.string().required(),
  groupId: Joi.string().required(),
  chainId: Joi.string().required(),
  isActive: Joi.boolean().allow(null),
  isAcceptingOrders: Joi.boolean().allow(null),
  name: Joi.string().allow(null),
  description: localizedItemSchema.required(),
  open: Joi.object(),
  openingHours: Joi.object().allow(null),
  lanes: Joi.array().items(laneSchema).allow(null),
  floorMap: Joi.object(floorMapSchema).allow(null),
  paymentModes: Joi.array().items(paymentModeSchema).allow(null),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
  ...contactSchema,
  ...addressInfoSchema,
};

export const { validate: validateUnit, isType: isUnit } = validateSchema<IUnit>(
  unitSchema,
  'Unit',
);
