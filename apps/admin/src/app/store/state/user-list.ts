import { IUser } from '../../shared/interfaces';

import { EntityState } from '@ngrx/entity';

export type IUserEntityState = EntityState<IUser>;

export interface IUserListState {
  users: IUserEntityState;
}
