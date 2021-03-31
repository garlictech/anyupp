import { take } from 'rxjs/operators';

import { Pipe, PipeTransform } from '@angular/core';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import { IChain, IGroup, IRoleContext, IUnit } from '@bgap/shared/types';
import { select, Store } from '@ngrx/store';

@Pipe({
  name: 'roleEntityNames',
})
export class RoleEntityNamesPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private _store: Store<any>) {}

  transform(roleContext: IRoleContext): unknown {
    const entitiesArr: string[] = [];

    if (roleContext.chainId) {
      this._store
        .pipe(
          select(chainsSelectors.getChainById(roleContext.chainId), take(1)),
        )
        .subscribe((chain: IChain | undefined): void => {
          entitiesArr.push(chain?.name || '');
        });
    }
    if (roleContext.groupId) {
      this._store
        .pipe(
          select(groupsSelectors.getGroupById(roleContext.groupId), take(1)),
        )
        .subscribe((group: IGroup | undefined): void => {
          entitiesArr.push(group?.name || '');
        });
    }
    if (roleContext.unitId) {
      this._store
        .pipe(select(unitsSelectors.getUnitById(roleContext.unitId), take(1)))
        .subscribe((unit: IUnit | undefined): void => {
          entitiesArr.push(unit?.name || '');
        });
    }

    return entitiesArr.filter((e): boolean => e !== '').join(' / ');
  }
}
