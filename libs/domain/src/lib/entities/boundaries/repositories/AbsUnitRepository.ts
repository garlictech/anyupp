import { CrudApi } from '../../models';
import { AbsRepositoryBase } from './AbsRepositoryBase';

export abstract class AbsUnitRepository extends AbsRepositoryBase<
  CrudApi.Unit,
  CrudApi.UpdateUnitInput
> {}
