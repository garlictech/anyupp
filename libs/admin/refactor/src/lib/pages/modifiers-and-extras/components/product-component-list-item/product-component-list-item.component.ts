import * as fp from 'lodash/fp';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProductComponent } from '@bgap/domain';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';

import { ModifiersAndExtrasListService } from '../../services/modifiers-and-extras-list.service';
import { ProductComponentFormComponent } from '../product-component-form/product-component-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-component-list-item',
  templateUrl: './product-component-list-item.component.html',
})
export class ProductComponentListItemComponent {
  @Input() productComponent!: ProductComponent;

  constructor(
    private _nbDialogService: NbDialogService,
    private _modifiersAndExtrasListService: ModifiersAndExtrasListService,
  ) {}

  public editProductComponent() {
    const dialog = this._nbDialogService.open(ProductComponentFormComponent);

    dialog.componentRef.instance.productComponent = fp.cloneDeep(
      this.productComponent,
    );
  }

  public deleteProductComponent(id: string) {
    this._modifiersAndExtrasListService.deleteProductComponent(id);
  }
}
