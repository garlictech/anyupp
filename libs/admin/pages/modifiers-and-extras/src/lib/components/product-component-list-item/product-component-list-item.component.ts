import * as fp from 'lodash/fp';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as CrudApi from '@bgap/crud-gql/api';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';

import { ProductComponentFormComponent } from '../product-component-form/product-component-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-component-list-item',
  templateUrl: './product-component-list-item.component.html',
})
export class ProductComponentListItemComponent {
  @Input() productComponent!: CrudApi.ProductComponent;

  constructor(private _nbDialogService: NbDialogService) {}

  public editProductComponent(): void {
    const dialog = this._nbDialogService.open(ProductComponentFormComponent);

    dialog.componentRef.instance.productComponent = fp.cloneDeep(
      this.productComponent,
    );
  }
}
