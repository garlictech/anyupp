import { SharedComponentsModule } from 'src/app/shared/modules/shared-components';
import { SharedFormsModule } from 'src/app/shared/modules/shared-forms';
import { PipesModule } from 'src/app/shared/pipes';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbActionsModule,
  NbBadgeModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbSelectModule,
  NbSpinnerModule,
  NbUserModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { FloorMapBodyComponent } from './components/floor-map-body/floor-map-body.component';
import { FloorMapOrdersComponent } from './components/floor-map-orders/floor-map-orders.component';
import { LaneItemComponent } from './components/lane-item/lane-item.component';
import { LanesBodyComponent } from './components/lanes-body/lanes-body.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { OrderEditComponent } from './components/order-edit/order-edit.component';
import { OrderPrintComponent } from './components/order-print/order-print.component';
import { OrderProductListComponent } from './components/order-product-list/order-product-list.component';
import { OrderTicketBodyComponent } from './components/order-ticket-body/order-ticket-body.component';
import { OrderTicketHistoryListComponent } from './components/order-ticket-history-list/order-ticket-history-list.component';
import { OrderTicketListItemComponent } from './components/order-ticket-list-item/order-ticket-list-item.component';
import { OrderTicketListComponent } from './components/order-ticket-list/order-ticket-list.component';
import { ReportsBodyComponent } from './components/reports-body/reports-body.component';
import { DashboardComponent } from './dashboard.component';
import { ReportsDailySalesPerTypeComponent } from './components/reports-daily-sales-per-type/reports-daily-sales-per-type.component';
import { ReportsUniqueGuestAvgSalesComponent } from './components/reports-unique-guest-avg-sales/reports-unique-guest-avg-sales.component';
import { ReportsOrdersAmountAvgSalesComponent } from './components/reports-orders-amount-avg-sales/reports-orders-amount-avg-sales.component';
import { ReportsDayHistoryComponent } from './components/reports-day-history/reports-day-history.component';
import { ReportsDailySalesPerPaymentMethodComponent } from './components/reports-daily-sales-per-payment-method/reports-daily-sales-per-payment-method.component';
import { ReportsHourlyBreakdownComponent } from './components/reports-hourly-breakdown/reports-hourly-breakdown.component';

const NB_MODULES = [
  NbLayoutModule,
  NbCardModule,
  NbCheckboxModule,
  NbListModule,
  NbEvaIconsModule,
  NbButtonModule,
  NbIconModule,
  NbSelectModule,
  NbActionsModule,
  NbBadgeModule,
  NbDialogModule,
  NbSpinnerModule,
  NbInputModule,
  NbUserModule,
];

@NgModule({
  declarations: [
    DashboardComponent,
    OrderTicketBodyComponent,
    OrderEditComponent,
    OrderTicketListItemComponent,
    OrderDetailsComponent,
    OrderProductListComponent,
    OrderPrintComponent,
    OrderTicketListComponent,
    OrderTicketHistoryListComponent,
    LanesBodyComponent,
    LaneItemComponent,
    FloorMapBodyComponent,
    FloorMapOrdersComponent,
    ReportsBodyComponent,
    ReportsDailySalesPerTypeComponent,
    ReportsUniqueGuestAvgSalesComponent,
    ReportsOrdersAmountAvgSalesComponent,
    ReportsDayHistoryComponent,
    ReportsDailySalesPerPaymentMethodComponent,
    ReportsHourlyBreakdownComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule,
    SharedComponentsModule,
    SharedFormsModule,
    RouterModule.forChild([
      {
        component: DashboardComponent,
        path: '',
      },
    ]),
    ...NB_MODULES,
  ],
})
export class DashboardModule {}
