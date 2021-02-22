import { cloneDeep as _cloneDeep } from 'lodash-es';

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProductCategory } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';

import { ProductCategoryFormComponent } from '../product-category-form/product-category-form.component';

@Component({
  selector: 'bgap-product-category-list-item',
  templateUrl: './product-category-list-item.component.html',
  styleUrls: ['./product-category-list-item.component.scss'],
})
export class ProductCategoryListItemComponent {
  @Input() productCategory!: IProductCategory;
  @Input() isFirst?: boolean;
  @Input() isLast?: boolean;
  @Output() positionChange = new EventEmitter();

  constructor(private _nbDialogService: NbDialogService) {}

  public editProductCategory(): void {
    const dialog = this._nbDialogService.open(ProductCategoryFormComponent, {
      dialogClass: 'form-dialog',
    });

    dialog.componentRef.instance.productCategory = _cloneDeep(
      this.productCategory
    );
  }

  public moveUp(): void {
    this.positionChange.emit({
      change: -1,
      productCategoryId: this.productCategory._id,
    });
  }

  public moveDown(): void {
    this.positionChange.emit({
      change: 1,
      productCategoryId: this.productCategory._id,
    });
  }
}
