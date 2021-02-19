import { createAction, props } from '@ngrx/store';

export const resetFloorMap = createAction('[FloorMap] Reset floorMap');
export const floorMapInitialized = createAction(
  '[FloorMap] Set initialized',
  props<{ initialized: boolean }>(),
);
