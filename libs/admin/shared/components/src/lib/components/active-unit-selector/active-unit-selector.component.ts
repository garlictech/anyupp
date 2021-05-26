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
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';
import { filterNullish } from '@bgap/shared/utils';
import { DataService } from '@bgap/admin/shared/data-access/data';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-active-unit-selector',
  templateUrl: './active-unit-selector.component.html',
  styleUrls: ['./active-unit-selector.component.scss'],
})
export class ActiveUnitSelectorComponent implements OnInit, OnDestroy {
  @Input() showIcon: boolean;
  public units$: Observable<CrudApi.Unit[]>;
  private _loggedUser!: CrudApi.AdminUser;

  constructor(
    private _store: Store,
    private _changeDetectorRef: ChangeDetectorRef,
    private _dataService: DataService,
  ) {
    this.showIcon = false;
    this.units$ = this._store.pipe(
      select(unitsSelectors.getSelectedGroupUnits),
      untilDestroyed(this),
    );
  }

  get selectedUnitId(): string | null | undefined {
    return this._loggedUser?.settings?.selectedUnitId;
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

  public onUnitSelected(unitId: string): void {
    if (
      this._loggedUser?.id &&
      unitId !== this._loggedUser?.settings?.selectedUnitId
    ) {
      this._dataService
        .updateAdminUserSettings(this._loggedUser.id || '', {
          ...(this._loggedUser?.settings || {}),
          selectedUnitId: unitId,
        })
        .subscribe();
    }

    this._changeDetectorRef.detectChanges();
  }
}
