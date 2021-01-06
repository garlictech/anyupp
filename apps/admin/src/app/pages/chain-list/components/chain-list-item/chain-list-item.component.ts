import { cloneDeep as _cloneDeep, get as _get } from 'lodash-es';
import { IChain } from 'src/app/shared/interfaces';

import { Component, Input } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

import { ChainFormComponent } from '../chain-form/chain-form.component';

@Component({
  selector: 'app-chain-list-item',
  templateUrl: './chain-list-item.component.html',
  styleUrls: ['./chain-list-item.component.scss'],
})
export class ChainListItemComponent {
  @Input() chain: IChain;

  constructor(private _nbDialogService: NbDialogService) {}

  get chainLogo(): string {
    return _get(this.chain, 'style.logos.logoDarkSizeL', '');
  }

  public editChain(): void {
    const dialog = this._nbDialogService.open(ChainFormComponent, {
      dialogClass: 'form-dialog',
    });

    dialog.componentRef.instance.chain = _cloneDeep(this.chain);
  }
}
