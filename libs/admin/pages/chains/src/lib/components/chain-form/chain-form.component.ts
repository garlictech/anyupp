import { cloneDeep } from 'lodash/fp';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import {
  addressFormGroup,
  addressIsEmpty,
  catchGqlError,
  contactFormGroup,
  EToasterType,
  multiLangValidator,
} from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { EImageType } from '@bgap/shared/types';
import { cleanObject, filterNullish } from '@bgap/shared/utils';
import { Store } from '@ngrx/store';

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
    private _store: Store,
    private _changeDetectorRef: ChangeDetectorRef,
    private _crudSdk: CrudSdkService,
  ) {
    super(_injector);

    this.dialogForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      description: this._formBuilder.group(
        {
          hu: [''],
          en: [''],
          de: [''],
        },
        { validators: multiLangValidator },
      ),
      isActive: ['', [Validators.required]],
      ...contactFormGroup(),
      ...addressFormGroup(this._formBuilder),
      style: this._formBuilder.group({
        colors: this._formBuilder.group({
          backgroundLight: ['#ffffff', [Validators.required]],
          backgroundDark: ['#ffffff', [Validators.required]],
          textDark: ['#ffffff', [Validators.required]],
          textLight: ['#ffffff', [Validators.required]],
          borderDark: ['#ffffff', [Validators.required]],
          borderLight: ['#ffffff', [Validators.required]],
          indicator: ['#ffffff', [Validators.required]],
          highlight: ['#ffffff', [Validators.required]],
          disabled: ['#ffffff', [Validators.required]],
        }),
        images: this._formBuilder.group({
          logo: [''],
          header: [''],
        }),
      }),
    });
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
        this._crudSdk.sdk
          .UpdateChain({
            input: {
              id: this.chain.id,
              ...value,
            },
          })
          .pipe(catchGqlError(this._store))
          .subscribe(() => {
            this._toasterService.show(
              EToasterType.SUCCESS,
              '',
              'common.updateSuccessful',
            );

            this.close();
          });
      } else {
        this._crudSdk.sdk
          .CreateChain({ input: value })
          .pipe(catchGqlError(this._store))
          .subscribe(() => {
            this._toasterService.show(
              EToasterType.SUCCESS,
              '',
              'common.insertSuccessful',
            );
            this.close();
          });
      }
    }
  }

  public logoUploadCallback = (image: string, param: string) => {
    (<FormControl>(
      this.dialogForm.get('style')?.get('images')?.get(param)
    )).setValue(image);

    if (this.chain?.id) {
      this.updateImageStyles(image, param).subscribe(() => {
        this._toasterService.show(
          EToasterType.SUCCESS,
          '',
          'common.imageUploadSuccess',
        );
      });
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageUploadSuccess',
      );
    }
  };

  public logoRemoveCallback = (param: string) => {
    (<FormControl>(
      this.dialogForm.get('style')?.get('images')?.get(param)
    )).setValue('');

    if (this.chain?.id) {
      this.updateImageStyles(null, param).subscribe();
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageRemoveSuccess',
      );
    }
  };

  private updateImageStyles(image: string | null, param: string) {
    if (this.chain?.id) {
      return this._crudSdk.sdk
        .GetChain({
          id: this.chain?.id,
        })
        .pipe(
          filterNullish(),
          switchMap(data => {
            const _data: CrudApi.Chain = cloneDeep(data);
            const chainStyleImagesRecord: Record<
              string,
              keyof CrudApi.ChainStyleImages
            > = {
              header: 'header',
              logo: 'logo',
            };

            if (!_data.style.images) {
              _data.style.images = {};
            }

            if (chainStyleImagesRecord[param]) {
              _data.style.images[chainStyleImagesRecord[param]] = image;
            }

            return this._crudSdk.sdk.UpdateChain({
              input: {
                id: _data.id,
                style: _data.style,
              },
            });
          }),
          catchGqlError(this._store),
        );
    } else {
      return EMPTY;
    }
  }
}
