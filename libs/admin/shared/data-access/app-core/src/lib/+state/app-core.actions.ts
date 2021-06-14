import { createAction, props } from '@ngrx/store';

export const gqlFailure = createAction(
  '[App Core] GQL failure',
  props<{ error: Record<string, unknown> }>(),
);

export const setLoginContextFailure = createAction(
  '[App Core] Login context failure',
  props<{ loginContextFailure: boolean }>(),
);
