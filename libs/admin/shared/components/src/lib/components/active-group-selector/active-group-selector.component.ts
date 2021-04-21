import { Observable } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { IAdminUser, IGroup } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-active-group-selector',
  templateUrl: './active-group-selector.component.html',
  styleUrls: ['./active-group-selector.component.scss'],
})
export class ActiveGroupSelectorComponent implements OnDestroy {
  @Input() showIcon: boolean;
  public groups$: Observable<IGroup[]>;
  private _loggedUser!: IAdminUser;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(
    private _store: Store<any>,
    private _dataService: DataService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.showIcon = false;
    this.groups$ = this._store.pipe(
      select(groupsSelectors.getSelectedChainGroups),
      untilDestroyed(this),
    );

    this._store
      .pipe(select(loggedUserSelectors.getLoggedUser), untilDestroyed(this))
      .subscribe((loggedUser: IAdminUser): void => {
        this._loggedUser = loggedUser;
      });
  }

  get selectedGroupId(): string | null | undefined {
    return this._loggedUser?.settings?.selectedGroupId;
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public onGroupSelected(groupId: string): void {
    if (
      this._loggedUser?.id &&
      groupId !== this._loggedUser?.settings?.selectedGroupId
    ) {
      this._dataService.updateAdminUserSettings(this._loggedUser.id || '', {
        ...(this._loggedUser?.settings || {}),
        selectedGroupId: groupId,
        selectedUnitId: null, // Reset unit id!
      });
    }

    this._changeDetectorRef.detectChanges();
  }
}
