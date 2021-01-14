import { get as _get } from 'lodash-es';
import { Observable } from 'rxjs';
import { IAdminUser, IGroup } from '../../../../interfaces';
import {
  currentUserSelectors,
  groupListSelectors,
} from '../../../../../store/selectors';
import { IState } from '../../../../../store';
import { DataService } from '../../../../services/data';
import { Component, Input, OnDestroy } from '@angular/core';
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
  private _adminUser: IAdminUser;

  constructor(
    private _store: Store<IState>,
    private _dataService: DataService
  ) {
    this.showIcon = false;
    this.groups$ = this._store.pipe(
      select(groupListSelectors.getSelectedChainGroups),
      untilDestroyed(this)
    );

    this._store
      .pipe(select(currentUserSelectors.getAdminUser), untilDestroyed(this))
      .subscribe((adminUser: IAdminUser): void => {
        this._adminUser = adminUser;
      });
  }

  get selectedGroupId(): string {
    return _get(this._adminUser, 'settings.selectedGroupId');
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public onGroupSelected(groupId: string): void {
    if (
      _get(this._adminUser, '_id') &&
      groupId !== _get(this._adminUser, 'settings.selectedGroupId')
    ) {
      this._dataService.updateAdminUserSettings(this._adminUser._id, {
        ..._get(this._adminUser, 'settings', {}),
        selectedGroupId: groupId,
        selectedUnitId: null, // Reset unit id!
      });
    }
  }
}
