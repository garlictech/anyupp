import * as fp from 'lodash/fp';

import { NGXLogger } from 'ngx-logger';

/* eslint-disable @typescript-eslint/dot-notation */
import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import {
  addressFormGroup, clearDbProperties, contactFormGroup, EToasterType, multiLangValidator
} from '@bgap/admin/shared/utils';
import { EImageType, IChain } from '@bgap/shared/types';

@Component({
  selector: 'bgap-chain-form',
  templateUrl: './chain-form.component.html',
  styleUrls: ['./chain-form.component.scss'],
})
export class ChainFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public chain!: IChain;
  public eImageType = EImageType;

  private _amplifyDataService: AmplifyDataService;
  private _logger: NGXLogger;

  constructor(protected _injector: Injector) {
    super(_injector);

    this._amplifyDataService = this._injector.get(AmplifyDataService);
    this._logger = this._injector.get(NGXLogger);

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
          backgroundLight: [''],
          backgroundDark: [''],
          textDark: [''],
          textLight: [''],
          borderDark: [''],
          borderLight: [''],
          indicator: [''],
          highlight: [''],
          disabled: [''],
        }),
        images: this._formBuilder.group({
          logo: [''],
          header: [''],
        }),
      }),
    });
  }

  get logoFilePath(): string {
    return this.chain?.style?.images?.logo;
  }

  get headerFilePath(): string {
    return this.chain?.style?.images?.header;
  }

  ngOnInit(): void {
    if (this.chain) {
      this.dialogForm.patchValue(clearDbProperties<IChain>(this.chain));
    } else {
      this.dialogForm.controls.isActive.patchValue(false);
    }
  }

  public async submit(): Promise<void> {
    if (this.dialogForm?.valid) {
      if (this.chain?.id) {
        try {
          await this._amplifyDataService.update<IChain>('getChain', 'updateChain',
            this.chain.id,
            () => this.dialogForm.value
          );

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
          await this._amplifyDataService.create('createChain', this.dialogForm?.value);

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

  public logoUploadCallback = (imagePath: string, key: string): void => {
    (<FormControl>(
      this.dialogForm.get('style')?.get('images')?.get(key)
    )).setValue(imagePath);

    // Update existing user's image
    if (this.chain?.id) {
      this._dataService
        .updateChainImagePath(this.chain.id, key, imagePath)
        .then((): void => {
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

  public logoRemoveCallback = (key: string): void => {
    (<FormControl>(
      this.dialogForm.get('style')?.get('images')?.get(key)
    )).setValue('');

    if (this.chain) {
      fp.set(`style.images.${key}`, null, this.chain);
    }

    // Update existing user's image
    if (this.chain?.id) {
      this._dataService
        .updateChainImagePath(this.chain.id, key, null)
        .then((): void => {
          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.imageRemoveSuccess',
          );
        });
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageRemoveSuccess',
      );
    }
  };
}
