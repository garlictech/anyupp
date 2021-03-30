import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleEntityNames',
})
export class RoleEntityNamesPipe implements PipeTransform {
  transform(): unknown {
    /*
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
    */

    return 'entities list'; // this._domSanitizer.bypassSecurityTrustHtml(entityPaths.join('<br>'));
  }
}
