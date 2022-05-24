import * as fp from 'lodash/fp';

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import * as CrudApi from '@bgap/crud-gql/api';
import { ProductCategoryFormComponent } from '../product-category-form/product-category-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-category-list-item',
  templateUrl: './product-category-list-item.component.html',
  styleUrls: ['./product-category-list-item.component.scss'],
})
export class ProductCategoryListItemComponent {
  @Input() productCategory!: CrudApi.ProductCategory;
  @Input() isFirst?: boolean;
  @Input() isLast?: boolean;
  @Output() positionChange = new EventEmitter();

  constructor(private _nbDialogService: NbDialogService) {}

  public editProductCategory() {
    const dialog = this._nbDialogService.open(ProductCategoryFormComponent);

    dialog.componentRef.instance.productCategory = fp.cloneDeep(
      this.productCategory,
    );
  }

  public moveUp() {
    this.positionChange.emit({
      change: -1,
      productCategoryId: this.productCategory.id,
    });
  }

  public moveDown() {
    this.positionChange.emit({
      change: 1,
      productCategoryId: this.productCategory.id,
    });
  }
}
