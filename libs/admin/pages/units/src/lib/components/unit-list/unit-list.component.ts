import * as fp from 'lodash/fp';
import { combineLatest, Observable } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import { IGroup, IUnit } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { UnitFormComponent } from '../unit-form/unit-form.component';

@UntilDestroy()
@Component({
  selector: 'bgap-unit-list',
  templateUrl: './unit-list.component.html',
})
export class UnitListComponent implements OnInit, OnDestroy {
  public units: IUnit[] = [];
  public selectedChainId$!: Observable<string | undefined | null>;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _nbDialogService: NbDialogService,
  ) {}

  ngOnInit(): void {
    this.selectedChainId$ = this._store.pipe(
      select(loggedUserSelectors.getSelectedChainId),
      untilDestroyed(this),
    );

    combineLatest([
      this._store.pipe(
        select(groupsSelectors.getSelectedChainGroups),
        untilDestroyed(this),
      ),
      this._store.pipe(
        select(unitsSelectors.getSelectedGroupUnits),
        untilDestroyed(this),
      ),
    ]).subscribe(([groups, units]: [IGroup[], IUnit[]]): void => {
      this.units = fp.cloneDeep(units);

      this.units.map((unit): void => {
        unit._group = groups.find((g): boolean => g.id === unit.groupId);
      });
    });
  }

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
