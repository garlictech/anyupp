import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedComponentsModule } from '@bgap/admin/shared/components';
import { AdminSharedFormsModule } from '@bgap/admin/shared/forms';
import { AdminSharedPipesModule } from '@bgap/admin/shared/pipes';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbSelectModule,
  NbTabsetModule,
  NbUserModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { ProductComponentFormComponent } from './components/product-component-form/product-component-form.component';
import { ProductComponentListItemComponent } from './components/product-component-list-item/product-component-list-item.component';
import { ProductComponentListComponent } from './components/product-component-list/product-component-list.component';

const NB_MODULES = [
  NbLayoutModule,
  NbCardModule,
  NbCheckboxModule,
  NbListModule,
  NbUserModule,
  NbIconModule,
  NbInputModule,
  NbEvaIconsModule,
  NbButtonModule,
  NbSelectModule,
  NbTabsetModule,
];

@NgModule({
  declarations: [
    ProductComponentListComponent,
    ProductComponentListItemComponent,
    ProductComponentFormComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    AdminSharedComponentsModule,
    AdminSharedFormsModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSharedPipesModule,
    RouterModule.forChild([
      {
        component: ProductComponentListComponent,
        path: '',
      },
    ]),
    ...NB_MODULES,
  ],
})
export class AdminPagesModifiersAndExtrasModule {}
