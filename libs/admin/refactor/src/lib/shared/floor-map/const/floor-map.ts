import { UnitMapObjectType } from '@bgap/domain';

export const FLOOR_MAP_config = {
  grid: 10,
  gridDivider: 5,
  backgroundColor: '#f8f8f8',
  lineStroke: '#ebebeb',
  strokeWidth: 1,
  cornerRadius: 2,
  tableFill: 'rgba(150, 111, 51, 0.7)',
  tableStroke: '#694d23',
  seatFill: 'rgba(67, 42, 4, 0.7)',
  seatStroke: '#32230b',
  barFill: 'rgba(0, 93, 127, 0.7)',
  barStroke: '#003e54',
  wallFill: 'rgba(136, 136, 136, 0.7)',
};

export const FLOOR_MAP_TEXT_config = {
  fontFamily: 'Arial',
  fontSize: 14,
  fill: '#ffffff',
  textAlign: 'center',
  originX: 'center',
  originY: 'center',
  selectable: false,
};

export const FLOOR_MAP_COMMON_BG_OPTIONS = {
  strokeWidth: FLOOR_MAP_config.strokeWidth,
  originX: 'center',
  originY: 'center',
  selectable: false,
  type: 'bg',
};

export const FLOOR_MAP_GRID_OPTIONS = {
  stroke: FLOOR_MAP_config.lineStroke,
  selectable: false,
  type: 'line',
  hoverCursor: 'default',
};

export const FLOOR_MAP_ENABLED_GROUP_OPTIONS = {
  centeredRotation: true,
  snapAngle: 15,
  selectable: true,
};

export const FLOOR_MAP_DISABLED_GROUP_OPTIONS = {
  selectable: false,
  hoverCursor: 'default',
};

export const FLOOR_MAP_CIRCLE_CONTROLS = {
  tl: true,
  tr: true,
  bl: true,
  br: true,
  mtr: false,
  mb: false,
  ml: false,
  mr: false,
  mt: false,
};

export const FLOOR_MAP_OBJECT_COMMON_DEFAULTS = {
  x: 10,
  y: 10,
  c: '',
  a: 0,
};

export const FLOOR_MAP_OBJECT_DEFAULTS = {
  [UnitMapObjectType.table_r]: {
    w: 150,
    h: 60,
  },
  [UnitMapObjectType.table_c]: {
    r: 30,
  },
  [UnitMapObjectType.seat_r]: {
    w: 30,
    h: 30,
  },
  [UnitMapObjectType.seat_c]: {
    r: 15,
  },
  [UnitMapObjectType.counter]: {
    w: 180,
    h: 60,
  },
  [UnitMapObjectType.wall]: {
    w: 10,
    h: 60,
  },
  [UnitMapObjectType.label]: {
    w: 150,
    h: 60,
    c: '..........',
  },
};

export const FLOOR_MAP_STATUS_COLORS = {
  NONE: '#ff3d71', // === color-danger-500
  PLACED: '#ffaa00', // === color-warning-500
  PROCESSING: '#3366ff', // === color-primary-500
  READY: '#ea3bf0', // === color-info-500
  SERVED: '#00d68f', // === color-success-500
};
