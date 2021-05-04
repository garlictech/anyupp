import { timer } from 'rxjs';
import { filter } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ConfirmDialogComponent } from '@bgap/admin/shared/components';
import {
  dashboardActions,
  dashboardSelectors,
  IDashboardSettings,
} from '@bgap/admin/shared/data-access/dashboard';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import {
  EDashboardListMode,
  EDashboardSize,
  ENebularButtonSize,
  IUnit,
} from '@bgap/shared/types';
import { zeroFill } from '@bgap/shared/utils';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public EDashboardListMode = EDashboardListMode;
  public dashboardSettings!: IDashboardSettings;
  public resized: boolean;
  public buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;
  public selectedUnit?: IUnit;
  public toggleFormControl: FormControl;
  public time?: string;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _dataService: DataService,
    private _nbDialogService: NbDialogService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.resized = false;
    this.toggleFormControl = new FormControl(false);
  }

  ngOnInit(): void {
    this._store
      .pipe(select(dashboardSelectors.getSettings), untilDestroyed(this))
      .subscribe((dashboardSettings: IDashboardSettings): void => {
        this.dashboardSettings = dashboardSettings;

        this.resized = this.dashboardSettings.size === EDashboardSize.LARGER;
        this.buttonSize = this.resized
          ? ENebularButtonSize.MEDIUM
          : ENebularButtonSize.SMALL;

        this._changeDetectorRef.detectChanges();
      });

    this._store
      .pipe(
        select(unitsSelectors.getSelectedUnit),
        filter((unit): boolean => !!unit),
        untilDestroyed(this),
      )
      .subscribe((unit: IUnit | undefined): void => {
        this.selectedUnit = unit;

        this.toggleFormControl.setValue(this.selectedUnit?.isAcceptingOrders);

        this._changeDetectorRef.detectChanges();
      });

    timer(0, 1000)
      .pipe(untilDestroyed(this))
      .subscribe((): void => {
        const date = new Date();
        this.time = `${zeroFill(date.getHours())}:${zeroFill(
          date.getMinutes(),
        )}:${zeroFill(date.getSeconds())}`;

        this._changeDetectorRef.detectChanges();
      });

    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public selectListMode(listMode: EDashboardListMode): void {
    if (this.dashboardSettings.listMode !== listMode) {
      this._store.dispatch(
        dashboardActions.setListMode({
          listMode,
        }),
      );

      this._store.dispatch(dashboardActions.resetSelectedOrderId());

      if (listMode !== EDashboardListMode.CURRENT) {
        this._store.dispatch(
          dashboardActions.setOrderEditing({
            orderEditing: false,
          }),
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
      }),
    );
  }

  public toggleAcceptingOrders($event: Event): void {
    $event.preventDefault();

    const dialog = this._nbDialogService.open(ConfirmDialogComponent);

    dialog.componentRef.instance.options = {
      message: this.selectedUnit?.isAcceptingOrders
        ? 'orders.confirmNotAcceptOrder'
        : 'orders.confirmIsAcceptOrder',
      buttons: [
        {
          label: 'common.ok',
          callback: (): void => {
            this._dataService.updateUnit((<IUnit>this.selectedUnit).id, {
              isAcceptingOrders: !(<IUnit>this.selectedUnit).isAcceptingOrders,
            });
          },
          status: 'success',
        },
        {
          label: 'common.cancel',
          callback: (): void => {
            /**/
          },
          status: 'basic',
        },
      ],
    };
  }
}
