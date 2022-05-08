import { CrudApi } from '@bgap/domain';
import { AbsRepositoryBase } from './AbsRepositoryBase';

export abstract class AbsUnitRepository extends AbsRepositoryBase<
  CrudApi.Unit,
  CrudApi.UpdateUnitInput
> {}
