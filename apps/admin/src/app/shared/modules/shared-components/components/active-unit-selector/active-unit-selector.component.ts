import { get as _get } from 'lodash-es';
import { Observable } from 'rxjs';
import { IAdminUser, IUnit } from 'src/app/shared/interfaces';
import { DataService } from 'src/app/shared/services/data';
import { IState } from 'src/app/store';
import { currentUserSelectors, unitListSelectors } from 'src/app/store/selectors';

import { Component, Input, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'app-active-unit-selector',
  templateUrl: './active-unit-selector.component.html',
  styleUrls: ['./active-unit-selector.component.scss'],
})
export class ActiveUnitSelectorComponent implements OnDestroy {
  @Input() showIcon: boolean;
  public units$: Observable<IUnit[]>;
  private _adminUser: IAdminUser;

  constructor(private _store: Store<IState>, private _dataService: DataService) {
    this.showIcon = false;
    this.units$ = this._store.pipe(select(unitListSelectors.getSelectedGroupUnits), untilDestroyed(this));

    this._store
      .pipe(select(currentUserSelectors.getAdminUser), untilDestroyed(this))
      .subscribe((adminUser: IAdminUser): void => {
        this._adminUser = adminUser;
      });
  }

  get selectedUnitId(): string {
    return _get(this._adminUser, 'settings.selectedUnitId');
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public onUnitSelected(unitId: string): void {
    if (_get(this._adminUser, '_id') && unitId !== _get(this._adminUser, 'settings.selectedUnitId')) {
      this._dataService.updateAdminUserSettings(this._adminUser._id, {
        ..._get(this._adminUser, 'settings', {}),
        selectedUnitId: unitId,
      });
    }
  }
}
