import { cloneDeep as _cloneDeep } from 'lodash-es';
import { combineLatest, Observable } from 'rxjs';
import { IGroup, IUnit } from 'src/app/shared/interfaces';
import { IState } from 'src/app/store';
import { currentUserSelectors, groupListSelectors, unitListSelectors } from 'src/app/store/selectors';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { UnitFormComponent } from './components/unit-form/unit-form.component';

@UntilDestroy()
@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
})
export class UnitListComponent implements OnInit, OnDestroy {
  public units: IUnit[];
  public selectedChainId$: Observable<string>;

  constructor(private _store: Store<IState>, private _nbDialogService: NbDialogService) {}

  ngOnInit(): void {
    this.selectedChainId$ = this._store.pipe(select(currentUserSelectors.getSelectedChainId), untilDestroyed(this));

    combineLatest([
      this._store.pipe(select(groupListSelectors.getSelectedChainGroups), untilDestroyed(this)),
      this._store.pipe(select(unitListSelectors.getSelectedGroupUnits), untilDestroyed(this)),
    ]).subscribe(([groups, units]: [IGroup[], IUnit[]]): void => {
      this.units = _cloneDeep(units);

      this.units.map((unit): void => {
        unit._group = groups.find((r): boolean => r._id === unit.groupId);
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
