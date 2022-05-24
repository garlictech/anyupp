import { createAction, props } from '@ngrx/store';
import { TempChainRestrictionObject } from './app-core.reducer';

export const gqlFailure = createAction(
  '[App Core] GQL failure',
  props<{ error: Record<string, unknown> }>(),
);

export const setLoginContextFailure = createAction(
  '[App Core] Login context failure',
  props<{ loginContextFailure: boolean }>(),
);

export const successAlert = createAction(
  '[App Core] Success alert',
  props<{ key: string }>(),
);

export const setClosableDialog = createAction(
  '[App Core] Set closable dialog',
  props<{ closableDialog: boolean }>(),
);

export const setPlayNewOrderNotification = createAction(
  '[App Core] Set play new order notification',
  props<{ playNewOrderNotification: boolean }>(),
);

// TEMP SECURITY
export const setChainRestrictionObject = createAction(
  '[App Core] Set chain restriction object',
  props<{ chainRestrictions: TempChainRestrictionObject }>(),
);
