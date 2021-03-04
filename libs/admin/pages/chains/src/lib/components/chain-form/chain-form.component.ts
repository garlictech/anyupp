import { get as _get, set as _set } from 'lodash-es';
import { NGXLogger } from 'ngx-logger';

/* eslint-disable @typescript-eslint/dot-notation */
import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import {
  clearDbProperties,
  contactFormGroup,
  EToasterType,
  multiLangValidator,
  amplifyObjectUpdater,
} from '@bgap/admin/shared/utils';
import { Chain } from '@bgap/api/graphql/schema';
import { EImageType, IChain } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';

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
      ...contactFormGroup(this._formBuilder),
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
    return _get(this.chain, 'style.images.logo');
  }

  get headerFilePath(): string {
    return _get(this.chain, 'style.images.header');
  }

  ngOnInit(): void {
    if (this.chain) {
      this.dialogForm.patchValue(clearDbProperties<IChain>(this.chain));
    } else {
      this.dialogForm.controls.isActive.patchValue(false);
    }
  }

  public submit(): void {
    if (this.dialogForm?.valid) {
      if (_get(this.chain, 'id')) {
        try {
          this._amplifyDataService.update(
            Chain,
            this.chain.id || '',
            amplifyObjectUpdater(this.dialogForm?.value),
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
          this._amplifyDataService.create(Chain, {
            ...cleanObject(this.dialogForm?.value),
          });

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
    if (_get(this.chain, 'id')) {
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
      _set(this.chain, `style.images.${key}`, null);
    }

    // Update existing user's image
    if (_get(this.chain, 'id')) {
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
