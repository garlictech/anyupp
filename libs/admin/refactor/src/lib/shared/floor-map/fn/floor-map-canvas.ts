import { fabric } from 'fabric';
import { FLOOR_MAP_config, FLOOR_MAP_GRID_OPTIONS } from '../const';

import * as utils from './floor-map-utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let fabricCanvas: any;
export let fabricEditMode: boolean;

export const initCanvas = (editMode: boolean) => {
  fabricEditMode = editMode;

  if (fabricCanvas) {
    fabricCanvas.clear();
    fabricCanvas.__eventListeners = {};
  }

  fabricCanvas = new fabric.Canvas('fabricCanvas');

  // Save fabricCanvas to the canvas element for allow testing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fabricCanvasEl: any = document.getElementById('fabricCanvas');
  if (fabricCanvasEl) {
    fabricCanvasEl.fabricCanvas = fabricCanvas;
  }

  fabricCanvas.backgroundColor = FLOOR_MAP_config.backgroundColor;
  fabricCanvas.selection = false; // Disable group selection

  fabricCanvas.hasBorders = fabricEditMode;
  fabricCanvas.hasControls = fabricEditMode;

  fabricCanvas.on('object:moving', _snapToGrid);
  fabricCanvas.on('object:rotating', _checkBoundingBox);
  fabricCanvas.on('object:scaling', _onScale);
  fabricCanvas.on('object:scaled', _onScaled);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerCanvasEvent = (event: any, callback: any) => {
  fabricCanvas.on(event, callback);
};

export const resizeCanvas = (w: number, h: number) => {
  fabricCanvas.setWidth(w);
  fabricCanvas.setHeight(h);
  fabricCanvas.calcOffset();

  _drawGrid();
  _sendLinesToBack();
};

const _drawGrid = () => {
  // horizontal lines
  for (let i = 0; i < (fabricCanvas.height || 0) / FLOOR_MAP_config.grid; i++) {
    fabricCanvas.add(
      new fabric.Line(
        [
          0,
          i * FLOOR_MAP_config.grid,
          fabricCanvas.width || 0,
          i * FLOOR_MAP_config.grid,
        ],
        FLOOR_MAP_GRID_OPTIONS,
      ),
    );
  }

  // vertical lines
  for (let i = 0; i < (fabricCanvas.width || 0) / FLOOR_MAP_config.grid; i++) {
    fabricCanvas.add(
      new fabric.Line(
        [
          i * FLOOR_MAP_config.grid,
          0,
          i * FLOOR_MAP_config.grid,
          fabricCanvas.height || 0,
        ],
        FLOOR_MAP_GRID_OPTIONS,
      ),
    );
  }
};

const _sendLinesToBack = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fabricCanvas.getObjects().map((o: any) => {
    if (o.type === 'line') {
      fabricCanvas.sendToBack(o);
    }
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _snapToGrid = (e: any) => {
  _checkBoundingBox(e);

  e.target.set({
    left:
      (Math.round(
        e.target.left / (FLOOR_MAP_config.grid / FLOOR_MAP_config.gridDivider),
      ) *
        FLOOR_MAP_config.grid) /
      FLOOR_MAP_config.gridDivider,
    top:
      (Math.round(
        e.target.top / (FLOOR_MAP_config.grid / FLOOR_MAP_config.gridDivider),
      ) *
        FLOOR_MAP_config.grid) /
      FLOOR_MAP_config.gridDivider,
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _checkBoundingBox = (e: any) => {
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
  if (objBoundingBox.left > (fabricCanvas.width || 0) - objBoundingBox.width) {
    obj.set('left', (fabricCanvas.width || 0) - objBoundingBox.width);
    obj.setCoords();
  }
  if (objBoundingBox.top > (fabricCanvas.height || 0) - objBoundingBox.height) {
    obj.set('top', (fabricCanvas.height || 0) - objBoundingBox.height);
    obj.setCoords();
  }
  if (objBoundingBox.left < 0) {
    obj.set('left', 0);
    obj.setCoords();
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _onScale = (e: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  e.target.getObjects().map((o: any) => {
    utils.fixTextScale(o, e.target);
    utils.fixBorderScale(o, e.target);
  });
};

const _roundScale = (val: number): number =>
  (Math.round(val / (FLOOR_MAP_config.grid / FLOOR_MAP_config.gridDivider)) *
    FLOOR_MAP_config.grid) /
  FLOOR_MAP_config.gridDivider;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _onScaled = (e: any) => {
  const target = e.target;
  const bg: fabric.Rect | fabric.Circle | null = utils.getObjectBg(target);
  const textField = target
    .getObjects()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ?.filter((o: any): boolean => o instanceof fabric.IText)[0];
  const commonParams = {
    width: _roundScale(e.target.getScaledWidth()),
    height: _roundScale(e.target.getScaledHeight()),
    scaleX: 1,
    scaleY: 1,
  };

  // Update radius
  if ((<fabric.Circle>bg).radius) {
    (<fabric.Circle>bg).setRadius(
      _roundScale(((<fabric.Circle>bg).radius || 0) * e.target.scaleX),
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
