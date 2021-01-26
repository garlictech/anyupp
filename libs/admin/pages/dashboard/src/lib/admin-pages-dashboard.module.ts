import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedComponentsModule } from '@bgap/admin/shared/components';
import { AdminSharedFormsModule } from '@bgap/admin/shared/forms';
import { AdminSharedPipesModule } from '@bgap/admin/shared/pipes';
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

import { FloorMapBodyComponent } from './components/floor-map-body';
import { FloorMapOrdersComponent } from './components/floor-map-orders';
import { LaneItemComponent } from './components/lane-item';
import { LanesBodyComponent } from './components/lanes-body';
import { OrderDetailsComponent } from './components/order-details';
import { OrderEditComponent } from './components/order-edit';
import { OrderPrintComponent } from './components/order-print';
import { OrderProductListComponent } from './components/order-product-list';
import { OrderTicketBodyComponent } from './components/order-ticket-body';
import { OrderTicketHistoryListComponent } from './components/order-ticket-history-list';
import { OrderTicketListComponent } from './components/order-ticket-list';
import { OrderTicketListItemComponent } from './components/order-ticket-list-item';
import { ReportsBodyComponent } from './components/reports-body';
import { ReportsDailySalesPerPaymentMethodComponent } from './components/reports-daily-sales-per-payment-method';
import { ReportsDailySalesPerTypeComponent } from './components/reports-daily-sales-per-type';
import { ReportsDayHistoryComponent } from './components/reports-day-history';
import { ReportsHourlyBreakdownComponent } from './components/reports-hourly-breakdown';
import { ReportsOrdersAmountAvgSalesComponent } from './components/reports-orders-amount-avg-sales';
import { ReportsUniqueGuestAvgSalesComponent } from './components/reports-unique-guest-avg-sales';
import { DashboardComponent } from './dashboard.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromDashboard from './+state/dashboard.reducer';
import { DashboardEffects } from './+state/dashboard.effects';

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
    AdminSharedComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    AdminSharedFormsModule,
    AdminSharedPipesModule,
    RouterModule.forChild([
      {
        component: DashboardComponent,
        path: '',
      },
    ]),
    ...NB_MODULES,
    StoreModule.forFeature(
      fromDashboard.DASHBOARD_FEATURE_KEY,
      fromDashboard.reducer
    ),
    EffectsModule.forFeature([DashboardEffects]),
  ],
})
export class AdminPagesDashboardModule {}
