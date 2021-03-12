import { take } from 'rxjs/operators';

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import { IAdminUserRole, IChain, IGroup, IUnit } from '@bgap/shared/types';
import { select, Store } from '@ngrx/store';

@Pipe({
  name: 'roleEntityNames',
})
export class RoleEntityNamesPipe implements PipeTransform {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _domSanitizer: DomSanitizer,
  ) {}

  transform(roles: IAdminUserRole): unknown {
    const entityPaths: string[] = [];

    Object.values(roles?.entities || {}).forEach((entity): void => {
      const entitiesArr: string[] = [];

      if (entity.chainId) {
        this._store
          .pipe(select(chainsSelectors.getChainById(entity.chainId), take(1)))
          .subscribe((chain: IChain | undefined): void => {
            entitiesArr.push(chain?.name || '');
          });
      }
      if (entity.groupId) {
        this._store
          .pipe(select(groupsSelectors.getGroupById(entity.groupId), take(1)))
          .subscribe((group: IGroup | undefined): void => {
            entitiesArr.push(group?.name || '');
          });
      }
      if (entity.unitId) {
        this._store
          .pipe(select(unitsSelectors.getUnitById(entity.unitId), take(1)))
          .subscribe((unit: IUnit | undefined): void => {
            entitiesArr.push(unit?.name || '');
          });
      }

      entityPaths.push(
        `@ ${entitiesArr.filter((e): boolean => e !== '').join(' / ')}`,
      );
    });

    return this._domSanitizer.bypassSecurityTrustHtml(entityPaths.join('<br>'));
  }
}
