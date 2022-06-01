import { fabric } from 'fabric';
import * as CrudApi from '@bgap/crud-gql/api';

import { customStringCompare } from '@bgap/shared/utils';
import { FabricGroup, FabricObjectProperties } from '@bgap/shared/types';

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
import { generateId, getObjectRadius, getObjectText } from './floor-map-utils';

export let mapRawData: CrudApi.FloorMapData;

export const initRawData = (w: number, h: number) => {
  mapRawData = {
    w,
    h,
    objects: [],
  };
};

export const loadRawData = (data: CrudApi.FloorMapData) => {
  mapRawData = Object.assign(mapRawData, data);

  (<CrudApi.FloorMapDataObject[]>data.objects)
    // Sort by type for z-indexing
    .sort(customStringCompare('t', true))
    .forEach((rawData: CrudApi.FloorMapDataObject) => {
      _drawObject(rawData, false);
    });
};

export const loadRawDataObject = (
  rawData: CrudApi.FloorMapDataObject,
  setActive: boolean,
) => {
  const dataIdx = mapRawData?.objects?.map(d => d.id).indexOf(rawData.id);

  if (dataIdx === undefined || !mapRawData?.objects) {
    throw new Error('HANDLE ME: dataIdx cannot be undefined');
  }

  if (dataIdx < 0) {
    mapRawData.objects.push(rawData);
  } else {
    mapRawData.objects[dataIdx] = rawData;
  }

  _drawObject(rawData, setActive);
};

const _drawObject = (o: CrudApi.FloorMapDataObject, setActive: boolean) => {
  const obj: fabric.Group = <fabric.Group>createObject(o);

  fabricCanvas.add(obj);

  if (setActive) {
    fabricCanvas.setActiveObject(obj);
  }
};

export const createObject = (
  mapObject: CrudApi.FloorMapDataObject,
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

export const removeActiveObject = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj: any = fabricCanvas.getActiveObject();

  if (obj) {
    if (!mapRawData?.objects) {
      throw new Error('HANDLE ME: data cannot be undefined');
    }

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

export const copyActiveObject = () => {
  const obj = fabricCanvas.getActiveObject();

  if (obj) {
    if (!mapRawData?.objects) {
      throw new Error('HANDLE ME: data cannot be undefined');
    }

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

export const setTextToActiveObject = (text: string) => {
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
  key: keyof CrudApi.FloorMapDataObject,
  value: string | number,
) => {
  const obj = fabricCanvas.getActiveObject();
  if (!mapRawData?.objects) {
    throw new Error('HANDLE ME: data cannot be undefined');
  }

  if (obj) {
    const objectIdx = mapRawData.objects.map(o => o.id).indexOf(obj.id);

    if (objectIdx >= 0) {
      // That's horror TODO please ASAP
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mapRawData as any).objects[objectIdx][key] = value;
    }
  }
};

export const getRawDataField = (
  obj: FabricGroup,
  key: keyof CrudApi.FloorMapDataObject,
): string | number =>
  mapRawData?.objects?.find(o => o.id === obj.id)?.[key] || '';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _getObjectProperties = (obj: any): FabricObjectProperties => ({
  id: obj.id,
  type: obj.type,
  width: Math.round(obj.scaleX * obj.width),
  height: Math.round(obj.scaleY * obj.height),
  radius: Math.round(obj.scaleX * (getObjectRadius(obj) || 0)),
  angle: obj.angle,
  left: obj.left,
  top: obj.top,
  caption: getObjectText(obj),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateObjectMapRawData = (e: any) => {
  const objectProperties: FabricObjectProperties = _getObjectProperties(
    e.target,
  );

  if (objectProperties) {
    if (!mapRawData?.objects) {
      throw new Error('HANDLE ME: data cannot be undefined');
    }

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
