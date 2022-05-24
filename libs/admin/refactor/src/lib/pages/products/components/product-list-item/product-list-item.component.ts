import * as fp from 'lodash/fp';
import { Observable } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  EProductLevel,
  EVariantAvailabilityType,
  Product,
} from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';

import { ProductListService } from '../../services/product-list.service';
import { ProductExtendFormComponent } from '../product-extend-form/product-extend-form.component';
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
  @Input() productLevel!: EProductLevel;
  @Input() currency = '';
  @Input() isFirst?: boolean;
  @Input() isLast?: boolean;
  @Output() positionChange = new EventEmitter();

  public hasRoleToEdit$: Observable<boolean>;
  public EProductLevel = EProductLevel;
  public EVariantAvailabilityType = EVariantAvailabilityType;

  constructor(
    private _nbDialogService: NbDialogService,
    private _productListService: ProductListService,
  ) {
    this.hasRoleToEdit$ = this._productListService.hasRoleToEdit$();
  }

  get variantsArray() {
    return Object.values(this.product?.variants || {});
  }

  public editProduct() {
    let dialog;

    if (this.productLevel === EProductLevel.CHAIN) {
      dialog = this._nbDialogService.open(ProductFormComponent);
    } else {
      dialog = this._nbDialogService.open(ProductExtendFormComponent);

      dialog.componentRef.instance.editing = true;
      dialog.componentRef.instance.currency = this.currency;
    }

    dialog.componentRef.instance.product = fp.cloneDeep(this.product);
    dialog.componentRef.instance.productLevel = this.productLevel;
  }

  public extendProduct() {
    const dialog = this._nbDialogService.open(ProductExtendFormComponent);

    if (!this.product) {
      throw new Error('HANDLE ME: this.product cannot be nullish');
    }

    dialog.componentRef.instance.product = { ...this.product };
    dialog.componentRef.instance.productLevel = this.productLevel;
    dialog.componentRef.instance.editing = false;
    dialog.componentRef.instance.currency = this.currency;
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
    switch (this.productLevel) {
      case EProductLevel.CHAIN:
        this._productListService.deleteChainProduct(id);
        break;
      case EProductLevel.GROUP:
        this._productListService.deleteGroupProduct(id);
        break;
      case EProductLevel.UNIT:
        this._productListService.deleteUnitProduct(id);
        break;
      default:
        break;
    }
  }
}
