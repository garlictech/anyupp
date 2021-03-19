import { Observable } from 'rxjs';

import { Component, Input, OnDestroy } from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { IAdminUser, IUnit } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-active-unit-selector',
  templateUrl: './active-unit-selector.component.html',
  styleUrls: ['./active-unit-selector.component.scss'],
})
export class ActiveUnitSelectorComponent implements OnDestroy {
  @Input() showIcon: boolean;
  public units$: Observable<IUnit[]>;
  private _adminUser!: IAdminUser;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private _store: Store<any>, private _dataService: DataService) {
    this.showIcon = false;
    this.units$ = this._store.pipe(
      select(unitsSelectors.getSelectedGroupUnits),
      untilDestroyed(this),
    );

    this._store
      .pipe(select(loggedUserSelectors.getLoggedUser), untilDestroyed(this))
      .subscribe((adminUser: IAdminUser): void => {
        this._adminUser = adminUser;
      });
  }

  get selectedUnitId(): string | null | undefined {
    return this._adminUser?.settings?.selectedUnitId;
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public onUnitSelected(unitId: string): void {
    if (
      this._adminUser?.id &&
      unitId !== this._adminUser?.settings?.selectedUnitId
    ) {
      this._dataService.updateAdminUserSettings(this._adminUser.id || '', {
        ...(this._adminUser?.settings || {}),
        selectedUnitId: unitId,
      });
    }
  }
}
