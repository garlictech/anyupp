import { Observable } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as CrudApi from '@bgap/crud-gql/api';
import { select, Store } from '@ngrx/store';
import { filterNullish } from '@bgap/shared/utils';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-active-group-selector',
  templateUrl: './active-group-selector.component.html',
  styleUrls: ['./active-group-selector.component.scss'],
})
export class ActiveGroupSelectorComponent implements OnInit, OnDestroy {
  @Input() showIcon: boolean;
  public groups$: Observable<CrudApi.Group[]>;
  private _loggedUser!: CrudApi.AdminUser;

  constructor(
    private _store: Store,
    private _dataService: DataService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.showIcon = false;
    this.groups$ = this._store.pipe(
      select(groupsSelectors.getSelectedChainGroups),
      untilDestroyed(this),
    );
  }

  get selectedGroupId(): string | null | undefined {
    return this._loggedUser?.settings?.selectedGroupId;
  }

  ngOnInit(): void {
    this._store
      .pipe(
        select(loggedUserSelectors.getLoggedUser),
        filterNullish(),
        untilDestroyed(this),
      )
      .subscribe(loggedUser => {
        this._loggedUser = loggedUser;

        this._changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public onGroupSelected(groupId: string): void {
    if (
      this._loggedUser?.id &&
      groupId !== this._loggedUser?.settings?.selectedGroupId
    ) {
      this._dataService
        .updateAdminUserSettings(this._loggedUser.id || '', {
          ...(this._loggedUser?.settings || {}),
          selectedGroupId: groupId,
          selectedUnitId: null, // Reset unit id!
        })
        .subscribe();
    }

    this._changeDetectorRef.detectChanges();
  }
}
