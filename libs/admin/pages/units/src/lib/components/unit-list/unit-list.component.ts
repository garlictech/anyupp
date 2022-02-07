import { combineLatest, Observable } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { groupsSelectors } from '@bgap/admin/store/groups';
import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
import { unitsSelectors } from '@bgap/admin/store/units';
import * as CrudApi from '@bgap/crud-gql/api';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { UnitFormComponent } from '../unit-form/unit-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-unit-list',
  templateUrl: './unit-list.component.html',
})
export class UnitListComponent implements OnInit, OnDestroy {
  public units: Array<CrudApi.Unit & { _group?: CrudApi.Group }> = [];
  public selectedGroupId$: Observable<string | undefined | null>;

  constructor(
    private _store: Store,
    private _nbDialogService: NbDialogService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.selectedGroupId$ = this._store.pipe(
      select(loggedUserSelectors.getSelectedGroupId),
      untilDestroyed(this),
    );
  }

  ngOnInit() {
    combineLatest([
      this._store.pipe(select(groupsSelectors.getSelectedChainGroups)),
      this._store.pipe(select(unitsSelectors.getSelectedGroupUnits)),
      this._store.pipe(select(loggedUserSelectors.getSelectedChainId)),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(
        ([groups, units, selectedChainId]: [
          CrudApi.Group[],
          CrudApi.Unit[],
          string | null | undefined,
        ]): void => {
          this.units = units
            .map(unit => ({
              ...unit,
              _group: groups.find((g): boolean => g.id === unit.groupId),
            }))
            .filter(u => u._group?.chainId === selectedChainId);

          this._changeDetectorRef.detectChanges();
        },
      );
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public addUnit(): void {
    this._nbDialogService.open(UnitFormComponent);
  }
}
