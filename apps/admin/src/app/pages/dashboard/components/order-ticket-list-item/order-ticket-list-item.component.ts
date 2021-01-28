import { Component, Input } from '@angular/core';
import { EDashboardTicketListType, IOrder } from '@bgap/shared/types';

import { currentStatus as currentStatusFn } from '../../../../shared/pure';

@Component({
  selector: 'bgap-order-ticket-list-item',
  templateUrl: './order-ticket-list-item.component.html',
  styleUrls: ['./order-ticket-list-item.component.scss'],
})
export class OrderTicketListItemComponent {
  @Input() order: IOrder;
  @Input() showMarkers: boolean;
  @Input() selectedOrderUserId?: string;
  @Input() ticketListType: EDashboardTicketListType;

  public currentStatus = currentStatusFn;
  public readyCount;

  /*
  ngOnChanges(): void {

    this.readyCount =
      this.ticketListType === EDashboardTicketListType.PLACED
        ? this.order.items.filter(
            (i: IOrderItem): boolean =>
              currentStatus(i.statusLog) === EOrderStatus.READY
          ).length
        : 0; // Show badhe only in placed list
  }
  */
}
