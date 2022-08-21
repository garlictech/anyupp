import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedComponentsModule } from '../../shared/components';
import { AdminSharedFloorMapModule } from '../../shared/floor-map';
import { AdminSharedFormsModule } from '../../shared/forms';
import { AdminSharedPipesModule } from '../../shared/pipes';
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

import { DashboardComponent } from './components/dashboard/dashboard.component';
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
  NbDialogModule,
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
  ],
  imports: [
    CommonModule,
    TranslateModule,
    AdminSharedComponentsModule,
    ReactiveFormsModule,
    ScrollingModule,
    FormsModule,
    AdminSharedFormsModule,
    AdminSharedPipesModule,
    AdminSharedFloorMapModule,
    RouterModule.forChild([
      {
        component: DashboardComponent,
        path: '',
      },
    ]),
    ...NB_MODULES,
  ],
})
export class AdminPagesDashboardModule {}
