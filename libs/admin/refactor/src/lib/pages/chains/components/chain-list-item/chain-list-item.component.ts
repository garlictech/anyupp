import * as fp from 'lodash/fp';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Chain } from '@bgap/domain';
import { NbDialogService } from '@nebular/theme';

import { ChainFormComponent } from '../chain-form/chain-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-chain-list-item',
  templateUrl: './chain-list-item.component.html',
  styleUrls: ['./chain-list-item.component.scss'],
})
export class ChainListItemComponent {
  @Input() chain!: Chain;

  constructor(private _nbDialogService: NbDialogService) {}

  get chainLogo(): string {
    return this.chain?.style?.images?.logo || '';
  }

  public editChain() {
    const dialog = this._nbDialogService.open(ChainFormComponent);

    dialog.componentRef.instance.chain = fp.cloneDeep(this.chain);
  }
}
