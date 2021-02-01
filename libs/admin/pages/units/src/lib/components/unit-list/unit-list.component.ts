import { cloneDeep as _cloneDeep } from 'lodash-es';
import { combineLatest, Observable } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { IGroup, IUnit } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { UnitFormComponent } from '../unit-form/unit-form.component';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';

@UntilDestroy()
@Component({
  selector: 'bgap-unit-list',
  templateUrl: './unit-list.component.html',
})
export class UnitListComponent implements OnInit, OnDestroy {
  public units: IUnit[] = [];
  public selectedChainId$!: Observable<string>;

  constructor(
    private _store: Store<any>,
    private _nbDialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.selectedChainId$ = this._store.pipe(
      select(loggedUserSelectors.getSelectedChainId),
      untilDestroyed(this)
    );

    combineLatest([
      this._store.pipe(
        select(groupsSelectors.getSelectedChainGroups),
        untilDestroyed(this)
      ),
      this._store.pipe(
        select(unitsSelectors.getSelectedGroupUnits),
        untilDestroyed(this)
      ),
    ]).subscribe(([groups, units]: [IGroup[], IUnit[]]): void => {
      this.units = _cloneDeep(units);

      this.units.map((unit): void => {
        unit._group = groups.find((r): boolean => r._id === unit.groupId);
      });
    });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public addUnit(): void {
    this._nbDialogService.open(UnitFormComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      hasScroll: true,
      dialogClass: 'form-dialog',
    });
  }
}
