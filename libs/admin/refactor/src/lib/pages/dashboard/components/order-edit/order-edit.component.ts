import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { currentStatus } from '@bgap/crud-gql/api';
import {
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentMode,
} from '@bgap/domain';
import { EDashboardSize, ENebularButtonSize } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { OrderService } from '../../../../shared/data-access/order';
import { dashboardSelectors } from '../../../../store/dashboard';

interface IPaymentMethodKV {
  key: string;
  value: PaymentMethod;
}

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss'],
})
export class OrderEditComponent implements OnInit {
  @Input() order!: Order;
  public paymentMethods: IPaymentMethodKV[] = [];
  public buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;
  public workingOrderStatus: boolean;

  constructor(
    private _store: Store,
    private _orderService: OrderService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.workingOrderStatus = false;
  }

  ngOnInit() {
    this.paymentMethods = Object.keys(PaymentMethod).map(key => ({
      key,
      value: PaymentMethod[<keyof typeof PaymentMethod>key],
    }));

    this._store
      .pipe(select(dashboardSelectors.getSize), untilDestroyed(this))
      .subscribe((size: EDashboardSize) => {
        this.buttonSize =
          size === EDashboardSize.LARGER
            ? ENebularButtonSize.MEDIUM
            : ENebularButtonSize.SMALL;

        this._changeDetectorRef.detectChanges();
      });
  }

  public updateQuantity(idx: number, value: number) {
    console.error('updateQuantity', idx, value);
    // this._orderService.updateQuantity(fp.cloneDeep(this.order), idx, value);
  }

  public removeOrder() {
    // DEPRECATED, NOT USED
    /*
    this._store
      .pipe(
        select(loggedUserSelectors.getLoggedUser),
        take(1),
        filterNullish(),
        switchMap(adminUser =>
          this._anyuppSdk.sdk.UpdateOrderStatus({
            input: {
              adminUserId: adminUser.id,
              orderId: this.order.id,
              status: OrderStatus.rejected,
            },
          }),
        ),
      )
      .subscribe(() => {
        this.workingOrderStatus = false;
        this._store.dispatch(
          dashboardActions.setOrderEditing({
            orderEditing: false,
          }),
        );
      });
      */
  }

  public async removeOrderItem(idx: number): Promise<void> {
    await this._orderService
      .updateOrderItemStatus$(this.order.id, OrderStatus.rejected, idx)
      .toPromise();
  }

  public async updateOrderPaymentMethod(
    paymentMode: PaymentMode,
  ): Promise<void> {
    await this._orderService
      .updateOrderPaymentMode$(this.order.id, paymentMode)
      .toPromise();
  }

  public isCurrentStatus(
    orderItem: OrderItem,
    status: keyof typeof OrderStatus,
  ): boolean {
    return currentStatus(orderItem.statusLog) === OrderStatus[status];
  }
}
