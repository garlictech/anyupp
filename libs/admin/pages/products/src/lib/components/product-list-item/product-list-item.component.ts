import { cloneDeep as _cloneDeep } from 'lodash-es';

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/logged-user';
import {
  EAdminRole, EProductLevel, EVariantAvailabilityType, IAdminUserRole, IProduct, IProductVariant
} from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { ProductExtendFormComponent } from '../product-extend-form/product-extend-form.component';
import { ProductFormComponent } from '../product-form/product-form.component';

@UntilDestroy()
@Component({
  selector: 'bgap-product-list-item',
  templateUrl: './product-list-item.component.html',
  styleUrls: ['./product-list-item.component.scss'],
})
export class ProductListItemComponent implements OnInit, OnDestroy {
  @Input() product: IProduct;
  @Input() pending: boolean;
  @Input() productLevel: EProductLevel;
  @Input() currency: string;
  @Input() isFirst?: boolean;
  @Input() isLast?: boolean;
  @Output() positionChange = new EventEmitter();

  public hasRoleToEdit = false;
  public EProductLevel = EProductLevel;
  public EVariantAvailabilityType = EVariantAvailabilityType;

  constructor(
    private _nbDialogService: NbDialogService,
    private _store: Store<any>
  ) {}

  ngOnInit(): void {
    this._store
      .pipe(
        select(loggedUserSelectors.getLoggedUserRoles),
        untilDestroyed(this)
      )
      .subscribe((adminUserRole: IAdminUserRole): void => {
        switch (this.productLevel) {
          case EProductLevel.CHAIN:
            this.hasRoleToEdit = [
              EAdminRole.SUPERUSER,
              EAdminRole.CHAIN_ADMIN,
            ].includes(adminUserRole.role);
            break;
          case EProductLevel.GROUP:
            this.hasRoleToEdit = [
              EAdminRole.SUPERUSER,
              EAdminRole.CHAIN_ADMIN,
              EAdminRole.GROUP_ADMIN,
            ].includes(adminUserRole.role);
            break;
          case EProductLevel.UNIT:
            this.hasRoleToEdit = [
              EAdminRole.SUPERUSER,
              EAdminRole.CHAIN_ADMIN,
              EAdminRole.GROUP_ADMIN,
              EAdminRole.UNIT_ADMIN,
            ].includes(adminUserRole.role);
            break;
          default:
            break;
        }
      });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  get variantsArray(): IProductVariant[] {
    return Object.values(this.product.variants || {});
  }

  public editProduct(): void {
    let dialog;

    if (this.productLevel === EProductLevel.CHAIN) {
      dialog = this._nbDialogService.open(ProductFormComponent, {
        dialogClass: 'form-dialog',
      });
    } else {
      dialog = this._nbDialogService.open(ProductExtendFormComponent, {
        dialogClass: 'form-dialog',
      });

      dialog.componentRef.instance.editing = true;
    }

    dialog.componentRef.instance.product = _cloneDeep(this.product);
    dialog.componentRef.instance.productLevel = this.productLevel;
    dialog.componentRef.instance.currency = this.currency;
  }

  public extendProduct(): void {
    const dialog = this._nbDialogService.open(ProductExtendFormComponent, {
      dialogClass: 'form-dialog',
    });

    dialog.componentRef.instance.product = { ...this.product };
    dialog.componentRef.instance.productLevel = this.productLevel;
    dialog.componentRef.instance.editing = false;
    dialog.componentRef.instance.currency = this.currency;
  }

  public moveUp(): void {
    this.positionChange.emit({
      change: -1,
      productId: this.product._id,
    });
  }

  public moveDown(): void {
    this.positionChange.emit({
      change: 1,
      productId: this.product._id,
    });
  }
}
