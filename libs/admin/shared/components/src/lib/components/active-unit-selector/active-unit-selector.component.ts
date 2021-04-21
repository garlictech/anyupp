import { Observable } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { IAdminUser, IUnit } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-active-unit-selector',
  templateUrl: './active-unit-selector.component.html',
  styleUrls: ['./active-unit-selector.component.scss'],
})
export class ActiveUnitSelectorComponent implements OnDestroy {
  @Input() showIcon: boolean;
  public units$: Observable<IUnit[]>;
  private _loggedUser!: IAdminUser;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(
    private _store: Store<any>,
    private _dataService: DataService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.showIcon = false;
    this.units$ = this._store.pipe(
      select(unitsSelectors.getSelectedGroupUnits),
      untilDestroyed(this),
    );

    this._store
      .pipe(select(loggedUserSelectors.getLoggedUser), untilDestroyed(this))
      .subscribe((loggedUser: IAdminUser): void => {
        this._loggedUser = loggedUser;
      });
  }

  get selectedUnitId(): string | null | undefined {
    return this._loggedUser?.settings?.selectedUnitId;
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public onUnitSelected(unitId: string): void {
    if (
      this._loggedUser?.id &&
      unitId !== this._loggedUser?.settings?.selectedUnitId
    ) {
      this._dataService.updateAdminUserSettings(this._loggedUser.id || '', {
        ...(this._loggedUser?.settings || {}),
        selectedUnitId: unitId,
      });
    }

    this._changeDetectorRef.detectChanges();
  }
}
