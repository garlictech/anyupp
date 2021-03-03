import { get as _get } from 'lodash-es';
import { Observable } from 'rxjs';

import { Component, Input, OnDestroy } from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { IAdminUser, IGroup } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-active-group-selector',
  templateUrl: './active-group-selector.component.html',
  styleUrls: ['./active-group-selector.component.scss'],
})
export class ActiveGroupSelectorComponent implements OnDestroy {
  @Input() showIcon: boolean;
  public groups$: Observable<IGroup[]>;
  private _adminUser!: IAdminUser;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private _store: Store<any>, private _dataService: DataService) {
    this.showIcon = false;
    this.groups$ = this._store.pipe(
      select(groupsSelectors.getSelectedChainGroups),
      untilDestroyed(this),
    );

    this._store
      .pipe(select(loggedUserSelectors.getLoggedUser), untilDestroyed(this))
      .subscribe((adminUser: IAdminUser): void => {
        this._adminUser = adminUser;
      });
  }

  get selectedGroupId(): string {
    return _get(this._adminUser, 'settings.selectedGroupId');
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public onGroupSelected(groupId: string): void {
    if (
      _get(this._adminUser, 'id') &&
      groupId !== _get(this._adminUser, 'settings.selectedGroupId')
    ) {
      this._dataService.updateAdminUserSettings(this._adminUser.id || '', {
        ..._get(this._adminUser, 'settings', {}),
        selectedGroupId: groupId,
        selectedUnitId: null, // Reset unit id!
      });
    }
  }
}
