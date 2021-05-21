import { fabric } from 'fabric';

import { customStringCompare } from '@bgap/shared/utils';
import {
  IFabricGroup,
  IFabricObjectProperties,
  IFloorMapData,
  IFloorMapDataObject,
} from '@bgap/shared/types';
import { CrudApi } from '@bgap/crud-gql/api';
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
    objects: [],
  };
};

export const loadRawData = (data: IFloorMapData): void => {
  mapRawData = Object.assign(mapRawData, data);

  (<IFloorMapDataObject[]>data.objects)
    // Sort by type for z-indexing
    .sort(customStringCompare('t', true))
    .forEach((rawData: IFloorMapDataObject): void => {
      _drawObject(rawData, false);
    });
};

export const loadRawDataObject = (
  rawData: IFloorMapDataObject,
  setActive: boolean,
): void => {
  const dataIdx = mapRawData.objects.map(d => d.id).indexOf(rawData.id);

  if (dataIdx < 0) {
    mapRawData.objects.push(rawData);
  } else {
    mapRawData.objects[dataIdx] = rawData;
  }

  _drawObject(rawData, setActive);
};

const _drawObject = (o: IFloorMapDataObject, setActive: boolean): void => {
  const obj: fabric.Group = <fabric.Group>createObject(o);

  fabricCanvas.add(obj);

  if (setActive) {
    fabricCanvas.setActiveObject(obj);
  }
};

export const createObject = (
  mapObject: IFloorMapDataObject,
): fabric.Group | undefined => {
  switch (mapObject.t) {
    case CrudApi.UnitMapObjectType.table_r:
      return createTableRect(mapObject);
    case CrudApi.UnitMapObjectType.table_c:
      return createTableCircle(mapObject);
    case CrudApi.UnitMapObjectType.seat_r:
      return createSeatRect(mapObject);
    case CrudApi.UnitMapObjectType.seat_c:
      return createSeatCircle(mapObject);
    case CrudApi.UnitMapObjectType.counter:
      return createBar(mapObject);
    case CrudApi.UnitMapObjectType.wall:
      return createWall(mapObject);
    case CrudApi.UnitMapObjectType.label:
      return createLabel(mapObject);
    default:
      return undefined;
  }
};

export const removeActiveObject = (): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj: any = fabricCanvas.getActiveObject();

  if (obj) {
    const objectIdx = mapRawData.objects.map(o => o.id).indexOf(obj.id);

    if (objectIdx >= 0) {
      mapRawData.objects.splice(objectIdx, 1);
    }

    obj.remove();
    fabricCanvas.remove(obj);
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();
  }
};

export const copyActiveObject = (): void => {
  const obj = fabricCanvas.getActiveObject();

  if (obj) {
    const objectIdx = mapRawData.objects.map(o => o.id).indexOf(obj.id);

    if (objectIdx >= 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapObjectRawData = { ...mapRawData.objects[objectIdx] };
      mapObjectRawData.id = generateId();
      mapObjectRawData.x = (mapObjectRawData.x || 0) + 10;
      mapObjectRawData.y = (mapObjectRawData.y || 0) + 10;

      loadRawDataObject(mapObjectRawData, true);
    }
  }
};

export const setTextToActiveObject = (text: string): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const setRawDataField = (
  key: keyof IFloorMapDataObject,
  value: string | number,
): void => {
  const obj = fabricCanvas.getActiveObject();

  if (obj) {
    const objectIdx = mapRawData.objects.map(o => o.id).indexOf(obj.id);

    if (objectIdx >= 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mapRawData.objects[objectIdx][key] = <any>value;
    }
  }
};

export const getRawDataField = (
  obj: IFabricGroup,
  key: keyof IFloorMapDataObject,
): string | number =>
  mapRawData.objects.find(o => o.id === obj.id)?.[key] || '';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _getObjectProperties = (obj: any): IFabricObjectProperties => ({
  id: obj.id,
  type: obj.type,
  width: getObjectBg(obj)?.width || 0,
  height: getObjectBg(obj)?.height || 0,
  radius: getObjectRadius(obj) || 0,
  angle: obj.angle,
  left: obj.left,
  top: obj.top,
  caption: getObjectText(obj),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateObjectMapRawData = (e: any): void => {
  const objectProperties: IFabricObjectProperties = _getObjectProperties(
    e.target,
  );

  if (objectProperties) {
    const objectIdx = mapRawData.objects
      .map(o => o.id)
      .indexOf(objectProperties.id);

    mapRawData.objects[objectIdx] = {
      ...mapRawData.objects[objectIdx],
      t: objectProperties.type,
      x: Math.round(objectProperties.left),
      y: Math.round(objectProperties.top),
      w: objectProperties.width,
      h: objectProperties.height,
      r: objectProperties.radius ? objectProperties.radius : undefined,
      a: objectProperties.angle ? objectProperties.angle : 0,
      c: objectProperties.caption,
    };
  }
};
