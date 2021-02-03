import { fabric } from 'fabric';

import { customStringCompare, objectToArray } from '@bgap/admin/shared/utils';
import {
  EUnitMapObjectType,
  IFabricGroup,
  IFabricObjectProperties,
  IFloorMapData,
  IFloorMapDataObject,
} from '@bgap/shared/types';

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

  mapRawData.objects[id!] = data;

  _drawObject(rawData, setActive);
};

const _drawObject = (o: IFloorMapDataObject, setActive: boolean): void => {
  const obj: any = createObject(o);

  fabricCanvas.add(obj);

  if (setActive) {
    fabricCanvas.setActiveObject(obj);
  }
};

export const createObject = (mapObject: IFloorMapDataObject): fabric.Group | undefined => {
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
    default:
      return undefined;
  }
};

export const removeActiveObject = (): void => {
  const obj: any = fabricCanvas.getActiveObject();

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
    const mapObjectRawData = { ...mapRawData.objects[(<any>obj).id] };
    mapObjectRawData.id = generateId();
    mapObjectRawData.x! += 10;
    mapObjectRawData.y! += 10;

    loadRawDataObject(mapObjectRawData, true);
  }
};

export const setTextToActiveObject = (text: string): void => {
  const obj: any = fabricCanvas.getActiveObject();

  if (obj) {
    const textField = obj
      .getObjects()
      .filter((o: fabric.Object): boolean => o instanceof fabric.IText)[0];

    if (textField) {
      textField.set('text', text);
      obj.dirty = true;
      fabricCanvas.renderAll();
    }
  }
};

export const setRawDataField = (key: keyof IFloorMapDataObject, value: string | number): void => {
  const obj = fabricCanvas.getActiveObject();

  if (obj) {
    mapRawData.objects[(<any>obj).id][key] = <any>value;
  }
};

export const getRawDataField = (
  obj: IFabricGroup,
  key: keyof IFloorMapDataObject
): string | number => mapRawData.objects[obj.id][key]!;

const _getObjectProperties = (obj: any): IFabricObjectProperties => ({
  id: obj.id,
  type: obj.type,
  width: getObjectBg(obj)!.width!,
  height: getObjectBg(obj)!.height!,
  radius: getObjectRadius(obj)!,
  angle: obj.angle,
  left: obj.left,
  top: obj.top,
  caption: getObjectText(obj),
});

export const updateObjectMapRawData = (e: any): void => {
  const objectProperties: IFabricObjectProperties = _getObjectProperties(
    e.target
  );

  if (objectProperties) {
    const { id, ...objectData } = objectProperties;

    mapRawData.objects[id] = {
      ...mapRawData.objects[id],
      t: objectData.type,
      x: Math.round(objectData.left),
      y: Math.round(objectData.top),
      w: objectData.width,
      h: objectData.height,
      r: objectData.radius ? objectData.radius : undefined,
      a: objectData.angle ? objectData.angle : 0,
      c: objectData.caption,
    };
  }
};
