import * as fp from 'lodash/fp';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IProductComponent } from '@bgap/shared/types';
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
  @Input() productComponent!: IProductComponent;

  constructor(private _nbDialogService: NbDialogService) {}

  public editProductComponent(): void {
    const dialog = this._nbDialogService.open(ProductComponentFormComponent);

    dialog.componentRef.instance.productComponent = fp.cloneDeep(
      this.productComponent,
    );
  }
}
