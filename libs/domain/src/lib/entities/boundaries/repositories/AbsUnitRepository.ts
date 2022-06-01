import { Unit, UpdateUnitInput } from '../../models';
import { AbsRepositoryBase } from './AbsRepositoryBase';

export abstract class AbsUnitRepository extends AbsRepositoryBase<
  Unit,
  UpdateUnitInput
> {}
