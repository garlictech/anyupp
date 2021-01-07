import { IAdminUser } from 'src/app/shared/interfaces';

import { EntityState } from '@ngrx/entity';

export type IAdminUserEntityState = EntityState<IAdminUser>

export interface IAdminUserListState {
  adminUsers: IAdminUserEntityState;
}
