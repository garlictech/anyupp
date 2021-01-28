import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductListItemComponent } from './components/product-list-item/product-list-item.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductExtendFormComponent } from './components/product-extend-form/product-extend-form.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromProducts from './+state/products.reducer';
import { ProductsEffects } from './+state/products.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromProducts.PRODUCTS_FEATURE_KEY,
      fromProducts.reducer
    ),
    EffectsModule.forFeature([ProductsEffects]),
  ],
  declarations: [
    ProductListComponent,
    ProductListItemComponent,
    ProductFormComponent,
    ProductExtendFormComponent,
  ],
})
export class AdminPagesProductsModule {}
