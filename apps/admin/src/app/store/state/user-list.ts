import { IUser } from 'src/app/shared/interfaces';

import { EntityState } from '@ngrx/entity';

export interface IUserEntityState extends EntityState<IUser> {}

export interface IUserListState {
  users: IUserEntityState;
}
