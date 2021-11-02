import { cloneDeep } from 'lodash/fp';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { chainsActions } from '@bgap/admin/shared/data-access/chains';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { addressIsEmpty } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { EImageType } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';

import { ChainFormService } from '../../services/chain-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-chain-form',
  templateUrl: './chain-form.component.html',
  styleUrls: ['./chain-form.component.scss'],
})
export class ChainFormComponent
  extends AbstractFormDialogComponent
  implements OnInit
{
  public chain?: CrudApi.Chain;
  public eImageType = EImageType;

  constructor(
    protected _injector: Injector,
    private _changeDetectorRef: ChangeDetectorRef,
    private _crudSdk: CrudSdkService,
    private _chainFormService: ChainFormService,
  ) {
    super(_injector);

    this.dialogForm = this._chainFormService.createChainFormGroup();
  }

  get logoImage() {
    return this.chain?.style?.images?.logo;
  }

  get headerImage() {
    return this.chain?.style?.images?.header;
  }

  ngOnInit(): void {
    if (this.chain) {
      this.dialogForm.patchValue(cleanObject(this.chain));
    } else {
      this.dialogForm.controls.isActive.patchValue(false);
    }

    this._changeDetectorRef.detectChanges();
  }

  public submit() {
    if (this.dialogForm?.valid) {
      const value = cloneDeep(this.dialogForm.value);

      if (addressIsEmpty(value.address)) {
        value.address = null;
      }

      if (this.chain?.id) {
        this._store.dispatch(
          chainsActions.updateChain({
            formValue: {
              ...value,
              id: this.chain?.id,
            },
          }),
        );
      } else {
        this._store.dispatch(
          chainsActions.createChain({
            formValue: value,
          }),
        );
      }
    }
  }

  public logoUploadCallback = (image: string, param: string) => {
    (<FormControl>(
      this.dialogForm.get('style')?.get('images')?.get(param)
    )).setValue(image);

    if (this.chain?.id) {
      this._store.dispatch(
        chainsActions.updateChainImageStyles({
          chainId: this.chain?.id,
          image,
          param,
        }),
      );
    } else {
      this._toasterService.showSimpleSuccess('common.imageUploadSuccess');
    }
  };

  public logoRemoveCallback = (param: string) => {
    (<FormControl>(
      this.dialogForm.get('style')?.get('images')?.get(param)
    )).setValue('');

    if (this.chain?.id) {
      this._store.dispatch(
        chainsActions.updateChainImageStyles({
          chainId: this.chain?.id,
          param,
        }),
      );
    } else {
      this._toasterService.showSimpleSuccess('common.imageRemoveSuccess');
    }
  };
}
