import { fabric } from 'fabric';
import {
  FLOOR_MAP_CIRCLE_CONTROLS,
  FLOOR_MAP_COMMON_BG_OPTIONS,
  FLOOR_MAP_CONFIG,
  FLOOR_MAP_DISABLED_GROUP_OPTIONS,
  FLOOR_MAP_ENABLED_GROUP_OPTIONS,
  FLOOR_MAP_TEXT_CONFIG,
} from 'src/app/shared/const';
import { EUnitMapObjectType } from 'src/app/shared/enums';
import { IFloorMapDataObject } from 'src/app/shared/interfaces';

import { fabricCanvas, fabricEditMode } from './floor-map-canvas';
import { getObjectBg } from './floor-map-utils';

const _wh = (rawObject: IFloorMapDataObject): any => ({
  width: rawObject.w,
  height: rawObject.h,
});

const _ital = (rawObject: IFloorMapDataObject): any => ({
  id: rawObject.id,
  top: rawObject.y,
  angle: rawObject.a,
  left: rawObject.x,
});

const _commonGroupOptions = (): any =>
  fabricEditMode
    ? FLOOR_MAP_ENABLED_GROUP_OPTIONS
    : FLOOR_MAP_DISABLED_GROUP_OPTIONS;

export const createTableRect = (
  rawObject: IFloorMapDataObject
): fabric.Group => {
  const bg = new fabric.Rect({
    fill: FLOOR_MAP_CONFIG.tableFill,
    stroke: FLOOR_MAP_CONFIG.tableStroke,
    rx: FLOOR_MAP_CONFIG.cornerRadius,
    ry: FLOOR_MAP_CONFIG.cornerRadius,
    ..._wh(rawObject),
    ...FLOOR_MAP_COMMON_BG_OPTIONS,
  });
  const caption = new fabric.IText(rawObject.c, FLOOR_MAP_TEXT_CONFIG);

  return new fabric.Group([bg, caption], <any>{
    type: EUnitMapObjectType.TABLE_RECTANGLE,
    ..._ital(rawObject),
    ..._commonGroupOptions(),
  });
};

export const createTableCircle = (
  rawObject: IFloorMapDataObject
): fabric.Group => {
  const bg = new fabric.Circle({
    radius: rawObject.r,
    fill: FLOOR_MAP_CONFIG.tableFill,
    stroke: FLOOR_MAP_CONFIG.tableStroke,
    ...FLOOR_MAP_COMMON_BG_OPTIONS,
  });
  const caption = new fabric.IText(rawObject.c, FLOOR_MAP_TEXT_CONFIG);
  const group = new fabric.Group([bg, caption], <any>{
    left: rawObject.x,
    top: rawObject.y,
    id: rawObject.id,
    type: EUnitMapObjectType.TABLE_CIRCLE,
    ..._commonGroupOptions(),
  });
  group.setControlsVisibility(FLOOR_MAP_CIRCLE_CONTROLS);

  return group;
};

export const createTriangle = (
  rawObject: IFloorMapDataObject
): fabric.Group => {
  const bg = new fabric.Triangle(<any>{
    radius: rawObject.r,
    fill: FLOOR_MAP_CONFIG.tableFill,
    stroke: FLOOR_MAP_CONFIG.tableStroke,
    ...FLOOR_MAP_COMMON_BG_OPTIONS,
  });
  const caption = new fabric.IText(rawObject.c, FLOOR_MAP_TEXT_CONFIG);

  return new fabric.Group([bg, caption], <any>{
    type: EUnitMapObjectType.TABLE_TRIANGLE,
    ..._ital(rawObject),
    ..._commonGroupOptions(),
  });
};

export const createSeatRect = (
  rawObject: IFloorMapDataObject
): fabric.Group => {
  const bg = new fabric.Rect(<any>{
    ..._wh(rawObject),
    fill: FLOOR_MAP_CONFIG.seatFill,
    stroke: FLOOR_MAP_CONFIG.seatStroke,
    rx: FLOOR_MAP_CONFIG.cornerRadius,
    ry: FLOOR_MAP_CONFIG.cornerRadius,
    ...FLOOR_MAP_COMMON_BG_OPTIONS,
  });
  const caption = new fabric.IText(rawObject.c, FLOOR_MAP_TEXT_CONFIG);

  return new fabric.Group([bg, caption], <any>{
    type: EUnitMapObjectType.SEAT_RECTANGLE,
    ..._ital(rawObject),
    ..._commonGroupOptions(),
  });
};

export const createSeatCircle = (
  rawObject: IFloorMapDataObject
): fabric.Group => {
  const bg = new fabric.Circle(<any>{
    radius: rawObject.r,
    fill: FLOOR_MAP_CONFIG.seatFill,
    stroke: FLOOR_MAP_CONFIG.seatStroke,
    ...FLOOR_MAP_COMMON_BG_OPTIONS,
  });
  const caption = new fabric.IText(rawObject.c, FLOOR_MAP_TEXT_CONFIG);
  const group = new fabric.Group([bg, caption], <any>{
    left: rawObject.x,
    top: rawObject.y,
    id: rawObject.id,
    type: EUnitMapObjectType.SEAT_CIRCLE,
    ..._commonGroupOptions(),
  });
  group.setControlsVisibility(FLOOR_MAP_CIRCLE_CONTROLS);

  return group;
};

export const createBar = (rawObject: IFloorMapDataObject): fabric.Group => {
  const bg = new fabric.Rect(<any>{
    ..._wh(rawObject),
    fill: FLOOR_MAP_CONFIG.barFill,
    stroke: FLOOR_MAP_CONFIG.barStroke,
    ...FLOOR_MAP_COMMON_BG_OPTIONS,
  });
  const caption = new fabric.IText(rawObject.c, FLOOR_MAP_TEXT_CONFIG);

  return new fabric.Group([bg, caption], <any>{
    type: EUnitMapObjectType.COUNTER,
    ..._ital(rawObject),
    ..._commonGroupOptions(),
  });
};

export const createWall = (rawObject: IFloorMapDataObject): fabric.Group => {
  const bg = new fabric.Rect(<any>{
    ..._wh(rawObject),
    fill: FLOOR_MAP_CONFIG.wallFill,
    ...FLOOR_MAP_COMMON_BG_OPTIONS,
  });

  return new fabric.Group([bg], <any>{
    type: EUnitMapObjectType.WALL,
    ..._ital(rawObject),
    ..._commonGroupOptions(),
  });
};

export const createLabel = (rawObject: IFloorMapDataObject): fabric.Group => {
  const bg = new fabric.Rect({
    fill: FLOOR_MAP_CONFIG.tableFill,
    opacity: 0,
    // stroke: FLOOR_MAP_CONFIG.tableStroke,
    ..._wh(rawObject),
    ...FLOOR_MAP_COMMON_BG_OPTIONS,
  });
  const caption = new fabric.IText(rawObject.c, {
    ...FLOOR_MAP_TEXT_CONFIG,
    fill: '#000',
  });

  return new fabric.Group([bg, caption], <any>{
    type: EUnitMapObjectType.LABEL,
    ..._ital(rawObject),
    ..._commonGroupOptions(),
  });
};

export const getObjectById = (id: string): fabric.Group =>
  fabricCanvas.getObjects().find((o): boolean => o.id === id);

export const setBorder = (
  obj: fabric.Group,
  color: string = FLOOR_MAP_CONFIG.seatStroke,
  strokeWidth: number = FLOOR_MAP_CONFIG.strokeWidth
): void => {
  const bgObj: fabric.Group = getObjectBg(obj);

  if (bgObj) {
    bgObj.set('stroke', color);
    bgObj.set('strokeWidth', strokeWidth);
  }
};

export const setBgColor = (
  obj: fabric.Group,
  color: string = FLOOR_MAP_CONFIG.seatFill
): void => {
  const bgObj: fabric.Group = getObjectBg(obj);

  if (bgObj) {
    bgObj.set('fill', color);
  }
};
