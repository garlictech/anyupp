import { cloneDeep } from 'lodash/fp';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { ProductComponent } from '@bgap/domain';
import { KeyValue, UpsertResponse } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';
import { UntilDestroy } from '@ngneat/until-destroy';
import { select } from '@ngrx/store';

import { AbstractFormDialogComponent } from '../../../../shared/forms';
import { chainsSelectors } from '../../../../store/chains';
import { loggedUserSelectors } from '../../../../store/logged-user';
import { ModifiersAndExtrasFormService } from '../../services/modifiers-and-extras-form.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-component-form',
  templateUrl: './product-component-form.component.html',
})
export class ProductComponentFormComponent
  extends AbstractFormDialogComponent
  implements OnInit
{
  public productComponent!: ProductComponent;
  public chainOptions$: Observable<KeyValue[]>;

  constructor(
    protected override _injector: Injector,
    private _changeDetectorRef: ChangeDetectorRef,
    private _modifiersAndExtrasFormService: ModifiersAndExtrasFormService,
  ) {
    super(_injector);

    this.dialogForm =
      this._modifiersAndExtrasFormService.createProductComponentFormGroup();

    this.chainOptions$ = this._store.select(
      chainsSelectors.getAllChainOptions(),
    );
  }

  ngOnInit() {
    if (this.productComponent) {
      this.dialogForm?.patchValue(cleanObject(this.productComponent));
    } else {
      // Patch ChainId
      this._store
        .pipe(select(loggedUserSelectors.getSelectedChainId), take(1))
        .subscribe((selectedChainId: string | undefined | null) => {
          if (selectedChainId) {
            this.dialogForm?.controls['chainId'].patchValue(selectedChainId);
          }
        });
    }

    this._changeDetectorRef.detectChanges();
  }

  public submit() {
    if (this.dialogForm?.valid) {
      this.setWorking$(true)
        .pipe(
          switchMap(() =>
            this._modifiersAndExtrasFormService.saveComponentForm$(
              cloneDeep({
                ...this.dialogForm?.value,
                dirty: this.productComponent?.dirty ? false : undefined,
              }),
              this.productComponent?.id,
            ),
          ),
          tap(() => this.setWorking$(false)),
        )
        .subscribe((response: UpsertResponse<unknown>) => {
          this._toasterService.showSimpleSuccess(response.type);

          this.close();
        });
    }
  }
}
