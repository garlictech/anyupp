import * as fp from 'lodash/fp';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProductCategory } from '@bgap/domain';
import { NbDialogService } from '@nebular/theme';

import { ProductCategoryFormComponent } from '../product-category-form/product-category-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-category-list-item',
  templateUrl: './product-category-list-item.component.html',
  styleUrls: ['./product-category-list-item.component.scss'],
})
export class ProductCategoryListItemComponent {
  @Input() productCategory?: ProductCategory;

  constructor(private _nbDialogService: NbDialogService) {}

  public editProductCategory() {
    const dialog = this._nbDialogService.open(ProductCategoryFormComponent);

    dialog.componentRef.instance.productCategory = fp.cloneDeep(
      this.productCategory,
    );
  }
}
