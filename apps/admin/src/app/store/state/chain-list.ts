import { EntityState } from '@ngrx/entity';
import { IChain } from '../../shared/interfaces';

export type IChainEntityState = EntityState<IChain>;

export interface IChainListState {
  chains: IChainEntityState;
}
