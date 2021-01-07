import { IChain } from 'src/app/shared/interfaces';

import { EntityState } from '@ngrx/entity';

export type IChainEntityState = EntityState<IChain>

export interface IChainListState {
  chains: IChainEntityState;
}
