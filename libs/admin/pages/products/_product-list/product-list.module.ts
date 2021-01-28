import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedComponentsModule } from '@bgap/admin/shared/components';
import { AdminSharedFormsModule } from '@bgap/admin/shared/forms';
import { AdminSharedPipesModule } from '@bgap/admin/shared/pipes';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbSelectModule,
  NbTabsetModule, NbUserModule
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { ProductExtendFormComponent } from './components/product-extend-form/product-extend-form.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductListItemComponent } from './components/product-list-item/product-list-item.component';
import { ProductListComponent } from './product-list.component';

const NB_MODULES = [
  NbLayoutModule,
  NbCardModule,
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
    ProductListComponent,
    ProductListItemComponent,
    ProductFormComponent,
    ProductExtendFormComponent,
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
        component: ProductListComponent,
        path: '',
      },
    ]),
    ...NB_MODULES,
  ],
})
export class ProductListModule {}
