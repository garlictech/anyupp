import { IAdminUser } from 'src/app/shared/interfaces';

import { EntityState } from '@ngrx/entity';

export interface IAdminUserEntityState extends EntityState<IAdminUser> {}

export interface IAdminUserListState {
  adminUsers: IAdminUserEntityState;
}
