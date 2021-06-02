import { createAction, props } from '@ngrx/store';

export const gqlFailure = createAction(
  '[Core] GQL failure',
  props<{ error: Record<string, unknown> }>(),
);
