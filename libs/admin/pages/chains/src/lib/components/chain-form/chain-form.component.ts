import * as fp from 'lodash/fp';
import { NGXLogger } from 'ngx-logger';
import { switchMap } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CrudSdkService } from '@bgap/admin/shared/data-access/data';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import {
  addressFormGroup,
  contactFormGroup,
  EToasterType,
  multiLangValidator,
} from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { EImageType } from '@bgap/shared/types';
import { cleanObject, filterNullish } from '@bgap/shared/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-chain-form',
  templateUrl: './chain-form.component.html',
  styleUrls: ['./chain-form.component.scss'],
})
export class ChainFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public chain?: CrudApi.Chain;
  public eImageType = EImageType;

  constructor(
    protected _injector: Injector,
    private _changeDetectorRef: ChangeDetectorRef,
    private _crudSdk: CrudSdkService,
    private _logger: NGXLogger,
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

  public async submit(): Promise<void> {
    if (this.dialogForm?.valid) {
      if (this.chain?.id) {
        try {
          await this._crudSdk.sdk
            .UpdateChain({
              input: {
                id: this.chain.id,
                ...this.dialogForm.value,
              },
            })
            .toPromise();

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.updateSuccessful',
          );
          this.close();
        } catch (error) {
          this._logger.error(`CHAIN UPDATE ERROR: ${JSON.stringify(error)}`);
        }
      } else {
        try {
          await this._crudSdk.sdk
            .CreateChain({ input: this.dialogForm?.value })
            .toPromise();

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.insertSuccessful',
          );
          this.close();
        } catch (error) {
          this._logger.error(`CHAIN INSERT ERROR: ${JSON.stringify(error)}`);
        }
      }
    }
  }

  public logoUploadCallback = async (
    image: string,
    param: string,
  ): Promise<void> => {
    (<FormControl>(
      this.dialogForm.get('style')?.get('images')?.get(param)
    )).setValue(image);

    if (this.chain?.id) {
      try {
        await this.updateImageStyles(param, image);

        this._toasterService.show(
          EToasterType.SUCCESS,
          '',
          'common.imageUploadSuccess',
        );
      } catch (error) {
        this._logger.error(
          `ADMIN USER IMAGE UPLOAD ERROR: ${JSON.stringify(error)}`,
        );
      }
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageUploadSuccess',
      );
    }
  };

  public logoRemoveCallback = async (param: string): Promise<void> => {
    (<FormControl>(
      this.dialogForm.get('style')?.get('images')?.get(param)
    )).setValue('');

    if (this.chain?.id) {
      await this.updateImageStyles(param, null);
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageRemoveSuccess',
      );
    }
  };

  private async updateImageStyles(param: string, image: string | null) {
    await this._crudSdk.sdk
      .GetChain({
        id:
          this.chain?.id ||
          'FIXME THIS IS FROM UNHANDLED UNKNOWN VALUE IN updateImageStyles',
      })
      .pipe(
        filterNullish(),
        switchMap(data => {
          const _data = fp.set(`style.images.${param}`, image, data);

          return this._crudSdk.sdk.UpdateChain({
            input: {
              id: _data.id,
              style: _data.style,
            },
          });
        }),
      )
      .toPromise();
  }
}
