import * as fp from 'lodash/fp';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProductComponentSet } from '@bgap/domain';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';

import { ModifiersAndExtrasListService } from '../../services/modifiers-and-extras-list.service';
import { ProductComponentSetFormComponent } from '../product-component-set-form/product-component-set-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-component-set-list-item',
  templateUrl: './product-component-set-list-item.component.html',
})
export class ProductComponentSetListItemComponent {
  @Input() productComponentSet!: ProductComponentSet;

  constructor(
    private _nbDialogService: NbDialogService,
    private _modifiersAndExtrasListService: ModifiersAndExtrasListService,
  ) {}

  public editProductComponentSet() {
    const dialog = this._nbDialogService.open(ProductComponentSetFormComponent);

    dialog.componentRef.instance.productComponentSet = fp.cloneDeep(
      this.productComponentSet,
    );
    dialog.componentRef.instance.editing = true;
  }

  public deleteProductComponentSet(id: string) {
    this._modifiersAndExtrasListService.deleteProductComponentSet(id);
  }
}
