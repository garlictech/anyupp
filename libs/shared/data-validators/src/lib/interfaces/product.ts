import * as Joi from 'joi';
import { validateSchema } from '../validator/validate';
import { IUnitProduct } from '@bgap/shared/types';

export const unitProductSchema: Joi.SchemaMap<IUnitProduct> = {
  __typename: Joi.string().valid('UnitProduct').optional(),
  id: Joi.string().required(),
  parentId: Joi.string().required(),
  chainId: Joi.string().required(),
  groupId: Joi.string().required(),
  unitId: Joi.string().required(),
  isVisible: Joi.boolean().required(),
  position: Joi.number().required(),
  variants: Joi.array().required(), //TODO: use an exact schema
  laneId: Joi.string().allow(null, ''),
  takeaway: Joi.boolean().allow(null),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
};

export const {
  validate: validateUnitProduct,
  isType: isUnitProduct,
} = validateSchema<IUnitProduct>(unitProductSchema, 'UnitProduct');
