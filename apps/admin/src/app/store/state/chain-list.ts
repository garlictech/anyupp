import { IChain } from 'src/app/shared/interfaces';

import { EntityState } from '@ngrx/entity';

export interface IChainEntityState extends EntityState<IChain> {}

export interface IChainListState {
  chains: IChainEntityState;
}
