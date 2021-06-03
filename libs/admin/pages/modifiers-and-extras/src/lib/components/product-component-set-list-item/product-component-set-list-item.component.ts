import * as fp from 'lodash/fp';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as CrudApi from '@bgap/crud-gql/api';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';

import { ProductComponentSetFormComponent } from '../product-component-set-form/product-component-set-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-component-set-list-item',
  templateUrl: './product-component-set-list-item.component.html',
})
export class ProductComponentSetListItemComponent {
  @Input() productComponentSet!: CrudApi.ProductComponentSet;

  constructor(private _nbDialogService: NbDialogService) {}

  public editProductComponent(): void {
    const dialog = this._nbDialogService.open(ProductComponentSetFormComponent);

    dialog.componentRef.instance.productComponentSet = fp.cloneDeep(
      this.productComponentSet,
    );
  }
}
