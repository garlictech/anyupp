import { IProducMixArrayItem } from 'libs/shared/types/src';
import { Observable } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Optional,
} from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-reports-product-mix',
  templateUrl: './reports-product-mix.component.html',
  styleUrls: ['./reports-product-mix.component.scss'],
})
export class ReportsProductMixComponent {
  @Input() productMixData$!: Observable<IProducMixArrayItem[]>;
  @Input() isModal = false;

  constructor(
    @Optional() private _nbDialogRef: NbDialogRef<unknown>,
    private _nbDialogService: NbDialogService,
  ) {}

  public showFullProductMix() {
    const dialog = this._nbDialogService.open(ReportsProductMixComponent);

    dialog.componentRef.instance.productMixData$ = this.productMixData$;
    dialog.componentRef.instance.isModal = true;
  }

  public close(): void {
    this._nbDialogRef.close();
  }
}
