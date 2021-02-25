import { fabric } from 'fabric';
import { EOrderStatus } from '@bgap/shared/types';
import { IFloorMapData, IFloorMapDataObject } from '@bgap/shared/types';

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 16);
};

export const fixTextScale = (o: fabric.Object, target: fabric.Object): void => {
  if (o instanceof fabric.IText) {
    const scaleX = (target.width || 0) / target.getScaledWidth();
    const scaleY = (target.height || 0) / target.getScaledHeight();

    o.scaleX = scaleX;
    o.scaleY = scaleY;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fixBorderScale = (o: any, target: fabric.Object): void => {
  if (!o.strokeWidthUnscaled && o.strokeWidth) {
    o.strokeWidthUnscaled = o.strokeWidth;
  }

  if (o.strokeWidthUnscaled) {
    o.strokeWidth = o.strokeWidthUnscaled / (target.scaleX || 1);
    if (o.strokeWidth === o.strokeWidthUnscaled) {
      o.strokeWidth = o.strokeWidthUnscaled / (target.scaleY || 1);
    }
  }
};

export const getGroupInitialData = (g: fabric.Group) => ({
  t: g.type,
  x: g.left,
  y: g.top,
});

export const getObjectText = (obj: fabric.Group): string => {
  if (obj?.getObjects) {
    const textField: fabric.IText = <fabric.IText>(
      obj.getObjects()?.filter((o): boolean => o instanceof fabric.IText)[0]
    );

    return textField?.text ? textField.text : '';
  }

  return '';
};

export const getObjectBg = (
  obj: fabric.Group,
): fabric.Rect | fabric.Circle | null => {
  if (obj?.getObjects) {
    return obj.getObjects()?.filter((o): boolean => o.type === 'bg')[0];
  }

  return null;
};

export const getObjectRadius = (obj: fabric.Group): number | null => {
  if (obj?.getObjects) {
    const circleField: fabric.Circle = <fabric.Circle>(
      obj.getObjects()?.filter((o): boolean => o instanceof fabric.Circle)[0]
    );

    return circleField ? circleField.radius || 1 : null;
  }

  return null;
};

export const isTable = (obj: fabric.Object): boolean =>
  (<string>obj.type || '').indexOf('table') === 0;

export const isTableOrSeat = (obj: fabric.Object): boolean =>
  (<string>obj.type || '').indexOf('table') === 0 ||
  (<string>obj.type || '').indexOf('seat') === 0;

export const isSeat = (obj: fabric.Object): boolean =>
  (<string>obj.type || '').indexOf('seat') === 0;

export const getTableSeatIds = (data: IFloorMapData): string[] =>
  Object.values(data?.objects || {})
    .filter((o: IFloorMapDataObject): boolean => o?.t?.indexOf('seat') === 0)
    .map((o: IFloorMapDataObject): string => getTableSeatId(o));

export const getStatusBgColor = (status: EOrderStatus): string => {
  switch (status) {
    case EOrderStatus.PLACED:
      return '#ffaa00'; // === color-warning-500
    case EOrderStatus.PROCESSING:
      return '#3366ff'; // === color-primary-500
    case EOrderStatus.READY:
      return '#ea3bf0'; // === color-info-500
    default:
      return '';
  }
};

export const getTableSeatId = (obj: IFloorMapDataObject): string =>
  `${obj.tID}.${obj.sID}`;
