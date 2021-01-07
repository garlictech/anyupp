import { fabric } from 'fabric';
import { EUnitMapObjectType } from 'src/app/shared/enums';
import { IFloorMapData, IFloorMapDataObject } from 'src/app/shared/interfaces';
import { customStringCompare, objectToArray } from 'src/app/shared/pure/utils';

import { fabricCanvas } from './floor-map-canvas';
import {
  createBar,
  createLabel,
  createSeatCircle,
  createSeatRect,
  createTableCircle,
  createTableRect,
  createWall,
} from './floor-map-objects';
import {
  generateId,
  getObjectBg,
  getObjectRadius,
  getObjectText,
} from './floor-map-utils';

export let mapRawData: IFloorMapData;

export const initRawData = (w: number, h: number): void => {
  mapRawData = {
    w,
    h,
    objects: {},
  };
};

export const loadRawData = (data: IFloorMapData): void => {
  mapRawData = Object.assign(mapRawData, data);

  objectToArray(data.objects, 'id')
    // Sort by type for z-indexing
    .sort(customStringCompare('t', true))
    .forEach((rawData: IFloorMapDataObject): void => {
      _drawObject(rawData, false);
    });
};

export const loadRawDataObject = (
  rawData: IFloorMapDataObject,
  setActive: boolean
): void => {
  const { id, ...data } = rawData;

  mapRawData.objects[id] = data;

  _drawObject(rawData, setActive);
};

const _drawObject = (o: IFloorMapDataObject, setActive: boolean): void => {
  const obj: fabric.Group = createObject(o);

  fabricCanvas.add(obj);

  if (setActive) {
    fabricCanvas.setActiveObject(obj);
  }
};

export const createObject = (mapObject: IFloorMapDataObject): fabric.Group => {
  switch (mapObject.t) {
    case EUnitMapObjectType.TABLE_RECTANGLE:
      return createTableRect(mapObject);
    case EUnitMapObjectType.TABLE_CIRCLE:
      return createTableCircle(mapObject);
    case EUnitMapObjectType.SEAT_RECTANGLE:
      return createSeatRect(mapObject);
    case EUnitMapObjectType.SEAT_CIRCLE:
      return createSeatCircle(mapObject);
    case EUnitMapObjectType.COUNTER:
      return createBar(mapObject);
    case EUnitMapObjectType.WALL:
      return createWall(mapObject);
    case EUnitMapObjectType.LABEL:
      return createLabel(mapObject);
  }
};

export const removeActiveObject = (): void => {
  const obj = fabricCanvas.getActiveObject();

  if (obj) {
    delete mapRawData.objects[obj.id];
    obj.remove();
    fabricCanvas.remove(obj);
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();
  }
};

export const copyActiveObject = (): void => {
  const obj = fabricCanvas.getActiveObject();

  if (obj) {
    const mapObjectRawData = { ...mapRawData.objects[obj.id] };
    mapObjectRawData.id = generateId();
    mapObjectRawData.x += 10;
    mapObjectRawData.y += 10;

    loadRawDataObject(mapObjectRawData, true);
  }
};

export const setTextToActiveObject = (text: string): void => {
  const obj = fabricCanvas.getActiveObject();

  if (obj) {
    const textField = obj
      .getObjects()
      .filter((o): boolean => o instanceof fabric.IText)[0];

    if (textField) {
      textField.set('text', text);
      fabricCanvas.renderAll();
    }
  }
};

export const setRawDataField = (key: string, value: string | number): void => {
  const obj = fabricCanvas.getActiveObject();

  if (obj) {
    mapRawData.objects[obj.id][key] = value;
  }
};

export const getRawDataField = (obj: any, key: string): string | number =>
  mapRawData.objects[obj.id][key];

const _getObjectProperties = (obj): any => ({
  id: obj.id,
  type: obj.type,
  width: getObjectBg(obj).width,
  height: getObjectBg(obj).height,
  radius: getObjectRadius(obj),
  angle: obj.angle,
  left: obj.left,
  top: obj.top,
  caption: getObjectText(obj),
});

export const updateObjectMapRawData = (e): void => {
  const objectProperties = _getObjectProperties(e.target);

  if (objectProperties) {
    const { id, ...objectData } = objectProperties;

    mapRawData.objects[id] = {
      ...mapRawData.objects[id],
      t: objectData.type,
      x: Math.round(objectData.left),
      y: Math.round(objectData.top),
      w: objectData.width,
      h: objectData.height,
      r: objectData.radius ? objectData.radius : null,
      a: objectData.angle ? objectData.angle : 0,
      c: objectData.caption,
    };
  }
};
