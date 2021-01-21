import { IConfirmOptions } from '@bgap/shared/types/interfaces';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'bgap-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
  public options: IConfirmOptions;

  constructor(private _nbDialogRef: NbDialogRef<unknown>) {}

  public click(callbackFn): void {
    if (callbackFn) {
      callbackFn();
    }

    this._nbDialogRef.close();
  }
}
