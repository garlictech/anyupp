import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedFormsModule } from '../../shared/forms';
import { AdminSharedPipesModule } from '../../shared/pipes';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbSelectModule,
  NbSpinnerModule,
  NbUserModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProductCategoryFormComponent } from './components/product-category-form/product-category-form.component';
import { ProductCategoryListItemComponent } from './components/product-category-list-item/product-category-list-item.component';
import { ProductCategoryListComponent } from './components/product-category-list/product-category-list.component';
import { ProductCategoryListService } from './services/product-category-list.service';
import { AdminSharedComponentsModule } from '../../shared/components';
import { AppsAdminModule } from '@bgap/apps/admin';

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
  NbSpinnerModule,
];

@NgModule({
  declarations: [
    ProductCategoryListComponent,
    ProductCategoryFormComponent,
    ProductCategoryListItemComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    AdminSharedFormsModule,
    AdminSharedComponentsModule,
    FormsModule,
    ScrollingModule,
    ReactiveFormsModule,
    AdminSharedPipesModule,
    AppsAdminModule,
    RouterModule.forChild([
      {
        component: ProductCategoryListComponent,
        path: '',
      },
    ]),
    ...NB_MODULES,
  ],
  providers: [ProductCategoryListService],
})
export class AdminPagesProductCategoriesModule {}
