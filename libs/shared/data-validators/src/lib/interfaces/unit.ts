import * as CrudApi from '@bgap/crud-gql/api';
import * as Joi from 'joi';
import { validateGqlList, validateSchema } from '../validator/validate';
import { addressInfoSchema } from './address';
import { contactSchema } from './contact';
import { dateStringSchema, timeStringSchema } from './date-time';
import { floorMapSchema } from './floor-map';
import { localizedItemSchema } from './localized-item';
import { paymentModeSchema } from './payment';

export const laneSchema: Joi.SchemaMap<CrudApi.Lane> = {
  id: Joi.string().allow(null, ''),
  name: Joi.string().required(),
  color: Joi.string().required(),
};

const dateIntervalOpenSchema = Joi.object({
  from: dateStringSchema.allow(null, ''),
  to: dateStringSchema.allow(null, ''),
}).or('from', 'to');
const timeIntervalSchema = Joi.alternatives(
  Joi.object({
    from: timeStringSchema.required(),
    to: timeStringSchema.required(),
  }),
  Joi.object({
    from: Joi.string().required().valid(''),
    to: Joi.string().required().valid(''),
  }),
  Joi.any().valid(null),
);
const customDailyScheduleSchema = Joi.object({
  date: dateStringSchema.required(),
  from: timeStringSchema.allow(null, ''),
  to: timeStringSchema.allow(null, ''),
});
const weeklySchedule = Joi.object({
  mon: timeIntervalSchema,
  tue: timeIntervalSchema,
  wed: timeIntervalSchema,
  thu: timeIntervalSchema,
  fri: timeIntervalSchema,
  sat: timeIntervalSchema,
  sun: timeIntervalSchema,
  custom: Joi.array().items(customDailyScheduleSchema).allow(null),
});

export const unitSchema: Joi.SchemaMap<CrudApi.Unit> = {
  id: Joi.string().required(),
  groupId: Joi.string().required(),
  chainId: Joi.string().required(),
  isActive: Joi.boolean().required(),
  isAcceptingOrders: Joi.boolean().required(),
  name: Joi.string().required(),
  description: localizedItemSchema.required(),
  open: dateIntervalOpenSchema.allow(null),
  openingHours: weeklySchedule.allow(null),
  lanes: Joi.array().items(laneSchema).allow(null),
  floorMap: Joi.object(floorMapSchema).allow(null),
  lastOrderNum: Joi.number().allow(null),
  timeZone: Joi.string().allow(null, ''),
  paymentModes: Joi.array().items(paymentModeSchema).allow(null),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
  merchantId: Joi.string().allow(null, ''),
  ...contactSchema,
  ...addressInfoSchema,
};

export const { validate: validateUnit, isType: isUnit } =
  validateSchema<CrudApi.Unit>(unitSchema, 'Unit');

export const { validate: validateUnitList, isType: isUnitList } =
  validateGqlList<CrudApi.Unit>(unitSchema, 'UnitList');
