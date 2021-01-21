import { IUser } from '@bgap/shared/types/interfaces';

import { EntityState } from '@ngrx/entity';

export type IUserEntityState = EntityState<IUser>;

export interface IUserListState {
  users: IUserEntityState;
}
