import { timer } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EDashboardListMode, EDashboardSize, ENebularButtonSize, IUnit } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import {
  ConfirmDialogComponent
} from '../../shared/modules/shared-components/components/confirm-dialog/confirm-dialog.component';
import { zeroFill } from '../../shared/pure';
import { DataService } from '../../shared/services/data';
import { IState } from '../../store';
import { dashboardActions } from '../../store/actions';
import { dashboardSelectors, unitListSelectors } from '../../store/selectors';
import { IDashboardSettings } from '../../store/state';

@UntilDestroy()
@Component({
  selector: 'bgap-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public EDashboardListMode = EDashboardListMode;
  public dashboardSettings: IDashboardSettings;
  public resized: boolean;
  public buttonSize: ENebularButtonSize;
  public selectedUnit: IUnit;
  public toggleFormControl: FormControl;
  public time: string;

  constructor(
    private _store: Store<IState>,
    private _dataService: DataService,
    private _nbDialogService: NbDialogService
  ) {
    this.resized = false;
    this.toggleFormControl = new FormControl(false);

    this._store
      .pipe(select(dashboardSelectors.getSettings), untilDestroyed(this))
      .subscribe((dashboardSettings: IDashboardSettings): void => {
        this.dashboardSettings = dashboardSettings;

        this.resized = this.dashboardSettings.size === EDashboardSize.LARGER;
        this.buttonSize = this.resized
          ? ENebularButtonSize.MEDIUM
          : ENebularButtonSize.SMALL;
      });

    this._store
      .pipe(
        select(unitListSelectors.getSelectedUnit),
        filter((unit): boolean => !!unit),
        untilDestroyed(this)
      )
      .subscribe((unit: IUnit): void => {
        this.selectedUnit = unit;

        this.toggleFormControl.setValue(this.selectedUnit.isAcceptingOrders);
      });
  }

  ngOnInit(): void {
    timer(0, 1000)
      .pipe(untilDestroyed(this))
      .subscribe((): void => {
        const date = new Date();
        this.time = `${zeroFill(date.getHours())}:${zeroFill(
          date.getMinutes()
        )}:${zeroFill(date.getSeconds())}`;
      });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public selectListMode(listMode: EDashboardListMode): void {
    if (this.dashboardSettings.listMode !== listMode) {
      this._store.dispatch(
        dashboardActions.setListMode({
          listMode,
        })
      );

      this._store.dispatch(dashboardActions.resetSelectedOrderId());

      if (listMode !== EDashboardListMode.CURRENT) {
        this._store.dispatch(
          dashboardActions.setOrderEditing({
            orderEditing: false,
          })
        );
      }
    }
  }

  public toggleResize(): void {
    this._store.dispatch(
      dashboardActions.setSize({
        size:
          this.dashboardSettings.size === EDashboardSize.NORMAL
            ? EDashboardSize.LARGER
            : EDashboardSize.NORMAL,
      })
    );
  }

  public toggleAcceptingOrders($event: Event): void {
    $event.preventDefault();

    const dialog = this._nbDialogService.open(ConfirmDialogComponent, {
      dialogClass: 'form-dialog',
    });

    dialog.componentRef.instance.options = {
      message: this.selectedUnit.isAcceptingOrders
        ? 'orders.confirmNotAcceptOrder'
        : 'orders.confirmIsAcceptOrder',
      buttons: [
        {
          label: 'common.ok',
          callback: (): void => {
            this._dataService.updateUnit(this.selectedUnit._id, {
              isAcceptingOrders: !this.selectedUnit.isAcceptingOrders,
            });
          },
          status: 'success',
        },
        {
          label: 'common.cancel',
          callback: (): void => {/**/},
          status: 'basic',
        },
      ],
    };
  }
}
