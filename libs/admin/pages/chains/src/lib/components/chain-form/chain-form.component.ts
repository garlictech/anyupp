import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { addressIsEmpty } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { EImageType, UpsertResponse } from '@bgap/shared/types';
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

      // Color migration
      this.dialogForm.patchValue({
        style: {
          colors: {
            primary:
              this.dialogForm.value.style?.colors?.primary ||
              this.dialogForm.value.style?.colors?.indicator ||
              '#30bf60',
            secondary:
              this.dialogForm.value.style?.colors?.secondary ||
              this.dialogForm.value.style?.colors?.textDark ||
              '#303030',
          },
        },
      });
    } else {
      this.dialogForm.patchValue({
        isActive: false,
        style: {
          colors: {
            primary: '#30bf60',
            secondary: '#303030',
          },
        },
      });
    }

    this._changeDetectorRef.detectChanges();
  }

  public submit() {
    if (this.dialogForm?.valid) {
      this._chainFormService
        .saveForm$(
          {
            ...this.dialogForm.value,
            address: addressIsEmpty(this.dialogForm.value.address)
              ? null
              : this.dialogForm.value.address,
          },
          this.chain?.id,
        )
        .subscribe((response: UpsertResponse<unknown>) => {
          this._toasterService.showSimpleSuccess(response.type);

          this.close();
        });
    }
  }

  public logoUploadCallback = (image: string, param: string) => {
    (<FormControl>(
      this.dialogForm.get('style')?.get('images')?.get(param)
    )).setValue(image);

    if (this.chain?.id) {
      this._chainFormService
        .updateChainImageStyles$(this.chain?.id, param, image)
        .subscribe(() => {
          this._toasterService.showSimpleSuccess('imageUpload');
        });
    } else {
      this._toasterService.showSimpleSuccess('imageUpload');
    }
  };

  public logoRemoveCallback = (param: string) => {
    (<FormControl>(
      this.dialogForm.get('style')?.get('images')?.get(param)
    )).setValue('');

    if (this.chain?.id) {
      this._chainFormService
        .updateChainImageStyles$(this.chain?.id, param)
        .subscribe(() => {
          this._toasterService.showSimpleSuccess('imageRemove');
        });
    } else {
      this._toasterService.showSimpleSuccess('imageRemove');
    }
  };
}
