import * as fp from 'lodash/fp';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import * as CrudApi from '@bgap/crud-gql/api';

import { Pipe, PipeTransform } from '@angular/core';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import { Store } from '@ngrx/store';

@Pipe({
  name: 'roleEntityNames',
})
export class RoleEntityNamesPipe implements PipeTransform {
  constructor(private _store: Store) {}

  transform(roleContext?: CrudApi.RoleContext | null): Observable<string> {
    let entitiesPath$;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const selectorFv = (id: string, selector: any) =>
      of(id).pipe(
        filter(fp.negate(fp.isEmpty)),
        switchMap(() => this._store.select(selector(id))),
        // TODO eliminate this any!!!
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((entity: any) => entity?.name),
        filter(fp.isString),
        startWith(''),
      );

    if (roleContext?.role === 'superuser') {
      entitiesPath$ = of('');
    } else {
      if (!roleContext || !roleContext.chainId) {
        throw new Error('HANDLE ME: handle undefined data');
      }

      entitiesPath$ = combineLatest([
        selectorFv(roleContext.chainId, chainsSelectors.getChainById),
        selectorFv(roleContext.groupId || '', groupsSelectors.getGroupById),
        selectorFv(roleContext.unitId || '', unitsSelectors.getUnitById),
      ]).pipe(
        map(([c, g, u]) => [c, g, u].filter(e => e !== '').join(' / ')),
        shareReplay(),
      );
    }

    return entitiesPath$;
  }
}
