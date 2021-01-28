import { get as _get } from 'lodash-es';
import { take } from 'rxjs/operators';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { select, Store } from '@ngrx/store';

import { IAdminUserRole, IChain, IGroup, IUnit } from '@bgap/shared/types';
import { IState } from '../../../store';
import {
  chainListSelectors,
  groupListSelectors,
  unitListSelectors,
} from '../../../store/selectors';

@Pipe({
  name: 'roleEntityNames',
})
export class RoleEntityNamesPipe implements PipeTransform {
  constructor(
    private _store: Store<any>,
    private _domSanitizer: DomSanitizer
  ) {}

  transform(roles: IAdminUserRole): unknown {
    const entityPaths = [];

    _get(roles, 'entities', []).forEach((entity): void => {
      const entitiesArr = [];

      if (entity.chainId) {
        this._store
          .pipe(
            select(chainListSelectors.getChainById(entity.chainId), take(1))
          )
          .subscribe((chain: IChain): void => {
            entitiesArr.push(_get(chain, 'name', ''));
          });
      }
      if (entity.groupId) {
        this._store
          .pipe(
            select(groupListSelectors.getGroupById(entity.groupId), take(1))
          )
          .subscribe((group: IGroup): void => {
            entitiesArr.push(_get(group, 'name', ''));
          });
      }
      if (entity.unitId) {
        this._store
          .pipe(select(unitListSelectors.getUnitById(entity.unitId), take(1)))
          .subscribe((unit: IUnit): void => {
            entitiesArr.push(_get(unit, 'name', ''));
          });
      }

      entityPaths.push(
        `@ ${entitiesArr.filter((e): boolean => e !== '').join(' / ')}`
      );
    });

    return this._domSanitizer.bypassSecurityTrustHtml(entityPaths.join('<br>'));
  }
}
