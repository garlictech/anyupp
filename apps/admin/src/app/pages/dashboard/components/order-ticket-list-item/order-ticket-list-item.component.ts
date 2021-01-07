import { IOrder, IOrderItem } from '../../shared/interfaces';
import {
  currentStatus,
  currentStatus as currentStatusFn,
} from 'src/app/shared/pure';

import { Component, Input, OnChanges } from '@angular/core';
import { EDashboardTicketListType, EOrderStatus } from '../../shared/enums';

@Component({
  selector: 'app-order-ticket-list-item',
  templateUrl: './order-ticket-list-item.component.html',
  styleUrls: ['./order-ticket-list-item.component.scss'],
})
export class OrderTicketListItemComponent implements OnChanges {
  @Input() order: IOrder;
  @Input() showMarkers: boolean;
  @Input() selectedOrderUserId?: string;
  @Input() ticketListType: EDashboardTicketListType;

  public currentStatus = currentStatusFn;
  public readyCount;

  ngOnChanges(): void {
    this.readyCount =
      this.ticketListType === EDashboardTicketListType.PLACED
        ? this.order.items.filter(
            (i: IOrderItem): boolean =>
              currentStatus(i.statusLog) === EOrderStatus.READY
          ).length
        : 0; // Show badhe only in placed list
  }
}
