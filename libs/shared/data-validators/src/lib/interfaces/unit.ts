import * as Joi from 'joi';
import * as CrudApi from '@bgap/crud-gql/api';

import { validateGqlList, validateSchema } from '../validator/validate';
import { addressInfoSchema } from './address';
import { contactSchema } from './contact';
import { ILane, IUnit } from '@bgap/shared/types';
import { floorMapSchema } from './floor-map';
import { localizedItemSchema } from './localized-item';
import { paymentModeSchema } from './payment';

export const laneSchema: Joi.SchemaMap<ILane> = {
  __typename: Joi.string().valid('Lane').optional(),
  id: Joi.string().allow(null, ''),
  name: Joi.string().required(),
  color: Joi.string().required(),
};
export const unitSchema: Joi.SchemaMap<IUnit> = {
  __typename: Joi.string().valid('Unit').optional(),
  id: Joi.string().required(),
  groupId: Joi.string().required(),
  chainId: Joi.string().required(),
  isActive: Joi.boolean().required(),
  isAcceptingOrders: Joi.boolean().required(),
  name: Joi.string().required(),
  description: localizedItemSchema.required(),
  open: Joi.object(),
  openingHours: Joi.object().allow(null),
  lanes: Joi.array().items(laneSchema).allow(null),
  floorMap: Joi.object(floorMapSchema).allow(null),
  lastOrderNum: Joi.number().allow(null),
  paymentModes: Joi.array().items(paymentModeSchema).allow(null),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
  merchantId: Joi.string().allow(null, ''),
  ...contactSchema,
  ...addressInfoSchema,
};

export const { validate: validateUnit, isType: isUnit } = validateSchema<IUnit>(
  unitSchema,
  'Unit',
);

export const {
  validate: validateUnitList,
  isType: isUnitList,
} = validateGqlList<CrudApi.Unit>(unitSchema, 'UnitList');
