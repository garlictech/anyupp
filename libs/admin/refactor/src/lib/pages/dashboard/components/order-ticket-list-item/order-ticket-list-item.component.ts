import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EDashboardTicketListType } from '@bgap/shared/types';
import * as CrudApi from '@bgap/crud-gql/api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-order-ticket-list-item',
  templateUrl: './order-ticket-list-item.component.html',
  styleUrls: ['./order-ticket-list-item.component.scss'],
})
export class OrderTicketListItemComponent {
  @Input() order!: CrudApi.Order;
  @Input() showMarkers?: boolean;
  @Input() selectedOrderUserId?: string;
  @Input() ticketListType?: EDashboardTicketListType;

  public currentStatus = CrudApi.currentStatus;
  public readyCount = 0;
  public EServingMode = CrudApi.ServingMode;

  /*
  ngOnChanges() {
    this.readyCount =
      this.ticketListType === EDashboardTicketListType.placed
        ? this.order.items.filter(
            (i: CrudApi.OrderItem): boolean =>
              currentStatus(i.statusLog) === CrudApi.OrderStatus.ready
          ).length
        : 0; // Show badhe only in placed list
  }
  */
}
