import { get as _get } from 'lodash-es';
import { Observable } from 'rxjs';
import { IAdminUser, IGroup } from 'src/app/shared/interfaces';
import { DataService } from 'src/app/shared/services/data';
import { IState } from 'src/app/store';
import { currentUserSelectors, groupListSelectors } from 'src/app/store/selectors';

import { Component, Input, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'app-active-group-selector',
  templateUrl: './active-group-selector.component.html',
  styleUrls: ['./active-group-selector.component.scss'],
})
export class ActiveGroupSelectorComponent implements OnDestroy {
  @Input() showIcon: boolean;
  public groups$: Observable<IGroup[]>;
  private _adminUser: IAdminUser;

  constructor(private _store: Store<IState>, private _dataService: DataService) {
    this.showIcon = false;
    this.groups$ = this._store.pipe(select(groupListSelectors.getSelectedChainGroups), untilDestroyed(this));

    this._store
      .pipe(select(currentUserSelectors.getAdminUser), untilDestroyed(this))
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
    if (_get(this._adminUser, '_id') && groupId !== _get(this._adminUser, 'settings.selectedGroupId')) {
      this._dataService.updateAdminUserSettings(this._adminUser._id, {
        ..._get(this._adminUser, 'settings', {}),
        selectedGroupId: groupId,
        selectedUnitId: null, // Reset unit id!
      });
    }
  }
}
