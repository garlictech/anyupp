import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CrudApi } from '@bgap/crud-gql/api';
import {
  dashboardActions,
  dashboardSelectors,
} from '@bgap/admin/shared/data-access/dashboard';
import { DataService, OrderService } from '@bgap/admin/shared/data-access/data';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { currentStatus as currentStatusFn } from '@bgap/admin/shared/data-access/orders';
import {
  EDashboardSize,
  ENebularButtonSize,
  EOrderStatus,
  IAdminUser,
  IOrder,
} from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import * as fp from 'lodash/fp';

interface IPaymentMethodKV {
  key: string;
  value: CrudApi.PaymentMethod;
}

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss'],
})
export class OrderEditComponent implements OnInit, OnDestroy {
  @Input() order!: IOrder;
  public paymentMethods: IPaymentMethodKV[] = [];
  public EOrderStatus = EOrderStatus;
  public buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;
  public workingOrderStatus: boolean;
  public currentStatus = currentStatusFn;

  private _loggedUser?: IAdminUser;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _orderService: OrderService,
    private _dataService: DataService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.workingOrderStatus = false;
  }

  ngOnInit(): void {
    Object.keys(CrudApi.PaymentMethod).forEach((key: string): void => {
      this.paymentMethods.push({
        key,
        value: CrudApi.PaymentMethod[<keyof typeof CrudApi.PaymentMethod>key],
      });
    });

    this._store
      .pipe(select(loggedUserSelectors.getLoggedUser), untilDestroyed(this))
      .subscribe((adminUser: IAdminUser): void => {
        this._loggedUser = adminUser;

        this._changeDetectorRef.detectChanges();
      });

    this._store
      .pipe(select(dashboardSelectors.getSize), untilDestroyed(this))
      .subscribe((size: EDashboardSize): void => {
        this.buttonSize =
          size === EDashboardSize.LARGER
            ? ENebularButtonSize.MEDIUM
            : ENebularButtonSize.SMALL;

        this._changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public updateQuantity(idx: number, value: number): void {
    this._orderService.updateQuantity(fp.cloneDeep(this.order), idx, value);
  }

  public removeOrder(): void {
    this._orderService
      .updateOrderStatus(fp.cloneDeep(this.order), EOrderStatus.REJECTED)
      .then(
        (): void => {
          this.workingOrderStatus = false;
        },
        (err): void => {
          console.error(err);
          this.workingOrderStatus = false;
        },
      );

    this._store.dispatch(
      dashboardActions.setOrderEditing({
        orderEditing: false,
      }),
    );
  }

  public removeOrderItem(idx: number): void {
    this._orderService.updateOrderItemStatus(
      this.order.id,
      EOrderStatus.REJECTED,
      idx,
    );
  }

  public updateOrderPaymentMethod(method: string): void {
    this._dataService.updateOrderPaymentMode(
      this._loggedUser?.settings?.selectedChainId || '',
      this._loggedUser?.settings?.selectedUnitId || '',
      this.order.id,
      {
        paymentMethod: method,
      },
    );
  }
}
