import { IConfirmOptions } from 'src/app/shared/interfaces';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  public options: IConfirmOptions;

  constructor(private _nbDialogRef: NbDialogRef<any>) {}

  public click(callbackFn: any): void {
    if (callbackFn) {
      callbackFn();
    }

    this._nbDialogRef.close();
  }
}
