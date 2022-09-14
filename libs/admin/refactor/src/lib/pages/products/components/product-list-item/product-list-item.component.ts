import * as fp from 'lodash/fp';

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { EVariantAvailabilityType, Product } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';

import { ProductListService } from '../../services/product-list.service';
import { ProductFormComponent } from '../product-form/product-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-list-item',
  templateUrl: './product-list-item.component.html',
  styleUrls: ['./product-list-item.component.scss'],
})
export class ProductListItemComponent {
  @Input() product?: Product;
  @Input() currency = '';
  @Input() isFirst?: boolean;
  @Input() isLast?: boolean;
  @Output() positionChange = new EventEmitter();

  public EVariantAvailabilityType = EVariantAvailabilityType;

  constructor(
    private _nbDialogService: NbDialogService,
    private _productListService: ProductListService,
  ) {}

  get variantsArray() {
    return Object.values(this.product?.variants || {});
  }

  public editProduct() {
    const dialog = this._nbDialogService.open(ProductFormComponent);
    dialog.componentRef.instance.currency = this.currency;
    dialog.componentRef.instance.product = fp.cloneDeep(this.product);
  }

  public duplicateProduct(id: string) {
    this._productListService.duplicateUnitProduct(id);
  }

  public moveUp() {
    this.positionChange.emit({
      change: -1,
      productId: this.product?.id,
    });
  }

  public moveDown() {
    this.positionChange.emit({
      change: 1,
      productId: this.product?.id,
    });
  }

  public deleteProduct(id: string) {
    this._productListService.deleteUnitProduct(id);
  }
}
