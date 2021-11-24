import * as CrudApi from '@bgap/crud-gql/api';
import * as fp from 'lodash/fp';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import {
  EProductLevel,
  EVariantAvailabilityType,
  Product,
} from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { ProductExtendFormComponent } from '../product-extend-form/product-extend-form.component';
import { ProductFormComponent } from '../product-form/product-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-list-item',
  templateUrl: './product-list-item.component.html',
  styleUrls: ['./product-list-item.component.scss'],
})
export class ProductListItemComponent implements OnInit, OnDestroy {
  @Input() product?: Product;
  @Input() productLevel!: EProductLevel;
  @Input() currency = '';
  @Input() isFirst?: boolean;
  @Input() isLast?: boolean;
  @Output() positionChange = new EventEmitter();

  public hasRoleToEdit = false;
  public EProductLevel = EProductLevel;
  public EVariantAvailabilityType = EVariantAvailabilityType;

  constructor(
    private _store: Store,
    private _nbDialogService: NbDialogService,
  ) {}

  ngOnInit(): void {
    this._store
      .pipe(select(loggedUserSelectors.getLoggedUserRole), untilDestroyed(this))
      .subscribe(role => {
        this.hasRoleToEdit = true;

        switch (this.productLevel) {
          case EProductLevel.CHAIN:
            this.hasRoleToEdit = [
              CrudApi.Role.superuser,
              CrudApi.Role.chainadmin,
            ].includes(role || CrudApi.Role.inactive);
            break;
          case EProductLevel.GROUP:
            this.hasRoleToEdit = [
              CrudApi.Role.superuser,
              CrudApi.Role.chainadmin,
              CrudApi.Role.groupadmin,
            ].includes(role || CrudApi.Role.inactive);
            break;
          case EProductLevel.UNIT:
            this.hasRoleToEdit = [
              CrudApi.Role.superuser,
              CrudApi.Role.chainadmin,
              CrudApi.Role.groupadmin,
              CrudApi.Role.unitadmin,
            ].includes(role || CrudApi.Role.inactive);
            break;
          default:
            break;
        }
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  get variantsArray() {
    return Object.values(this.product?.variants || {});
  }

  public editProduct(): void {
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

  public extendProduct(): void {
    const dialog = this._nbDialogService.open(ProductExtendFormComponent);

    if (!this.product) {
      throw new Error('HANDLE ME: this.product cannot be nullish');
    }

    dialog.componentRef.instance.product = { ...this.product };
    dialog.componentRef.instance.productLevel = this.productLevel;
    dialog.componentRef.instance.editing = false;
    dialog.componentRef.instance.currency = this.currency;
  }

  public moveUp(): void {
    this.positionChange.emit({
      change: -1,
      productId: this.product?.id,
    });
  }

  public moveDown(): void {
    this.positionChange.emit({
      change: 1,
      productId: this.product?.id,
    });
  }
}
