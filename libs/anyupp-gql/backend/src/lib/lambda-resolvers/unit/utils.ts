import { CrudSdk } from '@bgap/crud-gql/api';
import { Observable } from 'rxjs';

export interface UnitsResolverDeps {
  crudSdk: CrudSdk;
}

export type RegenerateUnitDataHandler = (unitId: string) => Observable<boolean>;
