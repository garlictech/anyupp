import { fabric } from 'fabric';
import { FLOOR_MAP_CONFIG, FLOOR_MAP_GRID_OPTIONS } from '../../const';

import * as utils from './floor-map-utils';

export let fabricCanvas;
export let fabricEditMode;

export const initCanvas = (editMode: boolean): void => {
  fabricEditMode = editMode;

  if (fabricCanvas) {
    fabricCanvas.clear();
    fabricCanvas.dispose();
    fabricCanvas.__eventListeners = {};
  }

  fabricCanvas = new fabric.Canvas('canvas');
  fabricCanvas.backgroundColor = FLOOR_MAP_CONFIG.backgroundColor;
  fabricCanvas.selection = false; // Disable group selection

  fabricCanvas.hasBorders = fabricEditMode;
  fabricCanvas.hasControls = fabricEditMode;

  fabricCanvas.on('object:moving', _snapToGrid);
  fabricCanvas.on('object:rotating', _checkBoundingBox);
  fabricCanvas.on('object:scaling', _onScale);
  fabricCanvas.on('object:scaled', _onScaled);
};

export const registerCanvasEvent = (event, callback): void => {
  fabricCanvas.on(event, callback);
};

export const resizeCanvas = (w, h): void => {
  fabricCanvas.setWidth(w);
  fabricCanvas.setHeight(h);
  fabricCanvas.calcOffset();

  _drawGrid();
  _sendLinesToBack();
};

const _drawGrid = (): void => {
  // horizontal lines
  for (let i = 0; i < fabricCanvas.height / FLOOR_MAP_CONFIG.grid; i++) {
    fabricCanvas.add(
      new fabric.Line(
        [
          0,
          i * FLOOR_MAP_CONFIG.grid,
          fabricCanvas.width,
          i * FLOOR_MAP_CONFIG.grid,
        ],
        FLOOR_MAP_GRID_OPTIONS
      )
    );
  }

  // vertical lines
  for (let i = 0; i < fabricCanvas.width / FLOOR_MAP_CONFIG.grid; i++) {
    fabricCanvas.add(
      new fabric.Line(
        [
          i * FLOOR_MAP_CONFIG.grid,
          0,
          i * FLOOR_MAP_CONFIG.grid,
          fabricCanvas.height,
        ],
        FLOOR_MAP_GRID_OPTIONS
      )
    );
  }
};

const _sendLinesToBack = (): void => {
  fabricCanvas.getObjects().map((o): void => {
    if (o.type === 'line') {
      fabricCanvas.sendToBack(o);
    }
  });
};

const _snapToGrid = (e): void => {
  _checkBoundingBox(e);

  e.target.set({
    left:
      (Math.round(
        e.target.left / (FLOOR_MAP_CONFIG.grid / FLOOR_MAP_CONFIG.gridDivider)
      ) *
        FLOOR_MAP_CONFIG.grid) /
      FLOOR_MAP_CONFIG.gridDivider,
    top:
      (Math.round(
        e.target.top / (FLOOR_MAP_CONFIG.grid / FLOOR_MAP_CONFIG.gridDivider)
      ) *
        FLOOR_MAP_CONFIG.grid) /
      FLOOR_MAP_CONFIG.gridDivider,
  });
};

const _checkBoundingBox = (e): void => {
  const obj = e.target;

  if (!obj) {
    return;
  }
  obj.setCoords();

  const objBoundingBox = obj.getBoundingRect();
  if (objBoundingBox.top < 0) {
    obj.set('top', 0);
    obj.setCoords();
  }
  if (objBoundingBox.left > fabricCanvas.width - objBoundingBox.width) {
    obj.set('left', fabricCanvas.width - objBoundingBox.width);
    obj.setCoords();
  }
  if (objBoundingBox.top > fabricCanvas.height - objBoundingBox.height) {
    obj.set('top', fabricCanvas.height - objBoundingBox.height);
    obj.setCoords();
  }
  if (objBoundingBox.left < 0) {
    obj.set('left', 0);
    obj.setCoords();
  }
};

const _onScale = (e): void => {
  e.target.getObjects().map((o): void => {
    utils.fixTextScale(o, e.target);
    utils.fixBorderScale(o, e.target);
  });
};

const _roundScale = (val: number): number =>
  (Math.round(val / (FLOOR_MAP_CONFIG.grid / FLOOR_MAP_CONFIG.gridDivider)) *
    FLOOR_MAP_CONFIG.grid) /
  FLOOR_MAP_CONFIG.gridDivider;

const _onScaled = (e): void => {
  const target = e.target;
  const bg: fabric.Rect | fabric.Circle = utils.getObjectBg(target);
  const textField = target
    .getObjects()
    ?.filter((o): boolean => o instanceof fabric.IText)[0];
  const commonParams = {
    width: _roundScale(e.target.getScaledWidth()),
    height: _roundScale(e.target.getScaledHeight()),
    scaleX: 1,
    scaleY: 1,
  };

  // Update radius
  if ((<fabric.Circle>bg).radius) {
    (<fabric.Circle>bg).setRadius(
      _roundScale((<fabric.Circle>bg).radius * e.target.scaleX)
    );
  }

  // Reset text scale
  if (textField) {
    textField.set({
      scaleX: 1,
      scaleY: 1,
    });
  }

  // Update background & container
  (<fabric.Object>bg).set(commonParams);
  target.set(commonParams);

  utils.fixBorderScale(bg, e.target);

  fabricCanvas.renderAll();
  fabricCanvas.calcOffset();
};
