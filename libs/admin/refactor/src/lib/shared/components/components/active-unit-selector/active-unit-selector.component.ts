import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AdminUser, Unit } from '@bgap/domain';
import { filterNullish } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { DataService } from '../../../../shared/data-access/data';
import { loggedUserSelectors } from '../../../../store/logged-user';
import { UnitCollectionService } from '../../../../store/units';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-active-unit-selector',
  templateUrl: './active-unit-selector.component.html',
  styleUrls: ['./active-unit-selector.component.scss'],
})
export class ActiveUnitSelectorComponent implements OnInit {
  @Input() showIcon: boolean;
  public units$: Observable<Unit[]>;
  private _loggedUser!: AdminUser;

  constructor(
    private _store: Store,
    private _changeDetectorRef: ChangeDetectorRef,
    private _dataService: DataService,
    private _unitCollectionService: UnitCollectionService,
  ) {
    this.showIcon = false;
    this.units$ = this._unitCollectionService.filteredEntities$;
  }

  get selectedUnitId(): string | null | undefined {
    return this._loggedUser?.settings?.selectedUnitId;
  }

  ngOnInit() {
    this._store
      .pipe(
        select(loggedUserSelectors.getLoggedUser),
        filterNullish(),
        tap((loggedUser: AdminUser) => {
          this._loggedUser = loggedUser;
        }),
        switchMap(() =>
          this._unitCollectionService.getAllCachedPaginatedData$({
            filter: {},
          }),
        ),
        untilDestroyed(this),
      )
      .subscribe(() => {
        this._changeDetectorRef.detectChanges();
      });
  }

  public onUnitSelected(unitId: string) {
    if (
      this._loggedUser?.id &&
      unitId !== this._loggedUser?.settings?.selectedUnitId
    ) {
      this._dataService
        .updateAdminUserSettings$(this._loggedUser.id, {
          ...(this._loggedUser?.settings || {}),
          selectedUnitId: unitId,
        })
        .subscribe();
    }

    this._changeDetectorRef.detectChanges();
  }
}
