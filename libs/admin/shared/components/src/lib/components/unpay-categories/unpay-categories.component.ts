import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { IConfirmOptions } from '@bgap/shared/types';
import { NbDialogRef } from '@nebular/theme';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-unpay-categories',
  templateUrl: './unpay-categories.component.html',
})
export class UnpayCategoriesComponent implements OnInit {
  public options?: IConfirmOptions;

  constructor(
    private _nbDialogRef: NbDialogRef<unknown>,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this._changeDetectorRef.detectChanges();
  }

  public click(callbackFn: () => void): void {
    if (callbackFn) {
      callbackFn();
    }

    this._nbDialogRef.close();
  }
}
