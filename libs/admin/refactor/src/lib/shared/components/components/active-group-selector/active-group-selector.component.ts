import { Observable } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AdminUser, Group } from '@bgap/domain';
import { filterNullish } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { DataService } from '../../../../shared/data-access/data';
import { GroupCollectionService } from '../../../../store/groups';
import { loggedUserSelectors } from '../../../../store/logged-user';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-active-group-selector',
  templateUrl: './active-group-selector.component.html',
  styleUrls: ['./active-group-selector.component.scss'],
})
export class ActiveGroupSelectorComponent implements OnInit {
  @Input() showIcon: boolean;
  public groups$: Observable<Group[]>;
  private _loggedUser!: AdminUser;

  constructor(
    private _store: Store,
    private _dataService: DataService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _groupCollectionService: GroupCollectionService,
  ) {
    this.showIcon = false;
    this.groups$ = this._groupCollectionService.filteredEntities$;
  }

  get selectedGroupId(): string | null | undefined {
    return this._loggedUser?.settings?.selectedGroupId;
  }

  ngOnInit() {
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

  public onGroupSelected(groupId: string) {
    if (
      this._loggedUser?.id &&
      groupId !== this._loggedUser?.settings?.selectedGroupId
    ) {
      this._dataService
        .updateAdminUserSettings$(this._loggedUser.id, {
          ...(this._loggedUser?.settings || {}),
          selectedGroupId: groupId,
          selectedUnitId: null, // Reset unit id!
        })
        .subscribe();
    }

    this._changeDetectorRef.detectChanges();
  }
}
