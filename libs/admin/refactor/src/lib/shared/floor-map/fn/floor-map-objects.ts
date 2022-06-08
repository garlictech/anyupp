import { fabric } from 'fabric';

import { FloorMapDataObject, UnitMapObjectType } from '@bgap/domain';

import {
  FLOOR_MAP_CIRCLE_CONTROLS,
  FLOOR_MAP_COMMON_BG_OPTIONS,
  FLOOR_MAP_config,
  FLOOR_MAP_DISABLED_GROUP_OPTIONS,
  FLOOR_MAP_ENABLED_GROUP_OPTIONS,
  FLOOR_MAP_TEXT_config,
} from '../const';
import { fabricCanvas, fabricEditMode } from './floor-map-canvas';
import { getObjectBg } from './floor-map-utils';

const _wh = (rawObject: FloorMapDataObject) => {
  if (rawObject.w === null || rawObject.h === null) {
    throw new Error('HANDLE ME: rawObject.w cannot be null');
  }

  return {
    width: rawObject.w as number | undefined,
    height: rawObject.h as number | undefined,
  };
};

const _ital = (rawObject: FloorMapDataObject) => {
  if (rawObject.a === null) {
    throw new Error('HANDLE ME: rawObject.angle cannot be null');
  }

  return {
    id: rawObject.id,
    top: rawObject.y,
    angle: rawObject.a as number | undefined,
    left: rawObject.x,
  };
};

const _commonGroupOptions = () =>
  fabricEditMode
    ? FLOOR_MAP_ENABLED_GROUP_OPTIONS
    : FLOOR_MAP_DISABLED_GROUP_OPTIONS;

export const createTableRect = (
  rawObject: FloorMapDataObject,
): fabric.Group => {
  const bg = new fabric.Rect({
    fill: FLOOR_MAP_config.tableFill,
    stroke: FLOOR_MAP_config.tableStroke,
    rx: FLOOR_MAP_config.cornerRadius,
    ry: FLOOR_MAP_config.cornerRadius,
    ..._wh(rawObject),
    ...FLOOR_MAP_COMMON_BG_OPTIONS,
  });
  const caption = new fabric.IText(rawObject.c || '', FLOOR_MAP_TEXT_config);

  return new fabric.Group([bg, caption], {
    type: UnitMapObjectType.table_r,
    data: {
      tID: rawObject.tID,
    },
    ..._ital(rawObject),
    ..._commonGroupOptions(),
  });
};

export const createTableCircle = (
  rawObject: FloorMapDataObject,
): fabric.Group => {
  if (rawObject.r === null) {
    throw new Error('HANDLE ME: rawObject.r cannot be null');
  }

  const bg = new fabric.Circle({
    radius: rawObject.r,
    fill: FLOOR_MAP_config.tableFill,
    stroke: FLOOR_MAP_config.tableStroke,
    ...FLOOR_MAP_COMMON_BG_OPTIONS,
  });
  const caption = new fabric.IText(rawObject.c || '', FLOOR_MAP_TEXT_config);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const group = new fabric.Group([bg, caption], <any>{
    left: rawObject.x,
    top: rawObject.y,
    id: rawObject.id,
    type: UnitMapObjectType.table_c,
    data: {
      tID: rawObject.tID,
    },
    ..._commonGroupOptions(),
  });
  group.setControlsVisibility(FLOOR_MAP_CIRCLE_CONTROLS);

  return group;
};

export const createSeatRect = (rawObject: FloorMapDataObject): fabric.Group => {
  const bg = new fabric.Rect({
    ..._wh(rawObject),
    fill: FLOOR_MAP_config.seatFill,
    stroke: FLOOR_MAP_config.seatStroke,
    rx: FLOOR_MAP_config.cornerRadius,
    ry: FLOOR_MAP_config.cornerRadius,
    ...FLOOR_MAP_COMMON_BG_OPTIONS,
  });
  const caption = new fabric.IText(rawObject.c || '', FLOOR_MAP_TEXT_config);

  return new fabric.Group([bg, caption], {
    type: UnitMapObjectType.seat_r,
    data: {
      tID: rawObject.tID,
      sID: rawObject.sID,
    },
    ..._ital(rawObject),
    ..._commonGroupOptions(),
  });
};

export const createSeatCircle = (
  rawObject: FloorMapDataObject,
): fabric.Group => {
  if (rawObject.r === null) {
    throw new Error('HANDLE ME: rawObject.r cannot be null');
  }

  const bg = new fabric.Circle({
    radius: rawObject.r,
    fill: FLOOR_MAP_config.seatFill,
    stroke: FLOOR_MAP_config.seatStroke,
    ...FLOOR_MAP_COMMON_BG_OPTIONS,
  });
  const caption = new fabric.IText(rawObject.c || '', FLOOR_MAP_TEXT_config);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const group = new fabric.Group([bg, caption], <any>{
    left: rawObject.x,
    top: rawObject.y,
    id: rawObject.id,
    type: UnitMapObjectType.seat_c,
    data: {
      tID: rawObject.tID,
      sID: rawObject.sID,
    },
    ..._commonGroupOptions(),
  });
  group.setControlsVisibility(FLOOR_MAP_CIRCLE_CONTROLS);

  return group;
};

export const createBar = (rawObject: FloorMapDataObject): fabric.Group => {
  const bg = new fabric.Rect({
    ..._wh(rawObject),
    fill: FLOOR_MAP_config.barFill,
    stroke: FLOOR_MAP_config.barStroke,
    ...FLOOR_MAP_COMMON_BG_OPTIONS,
  });
  const caption = new fabric.IText(rawObject.c || '', FLOOR_MAP_TEXT_config);

  return new fabric.Group([bg, caption], {
    type: UnitMapObjectType.counter,
    ..._ital(rawObject),
    ..._commonGroupOptions(),
  });
};

export const createWall = (rawObject: FloorMapDataObject): fabric.Group => {
  const bg = new fabric.Rect({
    ..._wh(rawObject),
    fill: FLOOR_MAP_config.wallFill,
    ...FLOOR_MAP_COMMON_BG_OPTIONS,
  });

  return new fabric.Group([bg], {
    type: UnitMapObjectType.wall,
    ..._ital(rawObject),
    ..._commonGroupOptions(),
  });
};

export const createLabel = (rawObject: FloorMapDataObject): fabric.Group => {
  const bg = new fabric.Rect({
    fill: FLOOR_MAP_config.tableFill,
    opacity: 0,
    // stroke: FLOOR_MAP_config.tableStroke,
    ..._wh(rawObject),
    ...FLOOR_MAP_COMMON_BG_OPTIONS,
  });
  const caption = new fabric.IText(rawObject.c || '', {
    ...FLOOR_MAP_TEXT_config,
    fill: '#000',
  });

  return new fabric.Group([bg, caption], {
    type: UnitMapObjectType.label,
    ..._ital(rawObject),
    ..._commonGroupOptions(),
  });
};

export const getObjectById = (id: string): fabric.Object | undefined =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fabricCanvas.getObjects().find((o: any): boolean => o.id === id);

export const setBorder = (
  obj: fabric.Group,
  color: string = FLOOR_MAP_config.seatStroke,
  strokeWidth: number = FLOOR_MAP_config.strokeWidth,
) => {
  const bgObj: fabric.Rect | fabric.Circle | null = getObjectBg(obj);

  if (bgObj) {
    (<fabric.Object>bgObj).set('stroke', color);
    (<fabric.Object>bgObj).set('strokeWidth', strokeWidth);
  }
};

export const setBgColor = (
  obj: fabric.Group,
  color: string = FLOOR_MAP_config.seatFill,
) => {
  const bgObj: fabric.Rect | fabric.Circle | null = getObjectBg(obj);

  if (bgObj) {
    (<fabric.Object>bgObj).set('fill', color);
  }
};
