import { EntityState } from '@ngrx/entity';
import { IChain } from '@bgap/shared/types/interfaces';

export type IChainEntityState = EntityState<IChain>;

export interface IChainListState {
  chains: IChainEntityState;
}
