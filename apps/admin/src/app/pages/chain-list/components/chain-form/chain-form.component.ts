import { get as _get, set as _set } from 'lodash-es';
import { EImageType } from '../../../../shared/enums';
import { IChain } from '../../../../shared/interfaces';
import { AbstractFormDialogComponent } from '../../../../shared/modules/shared-forms/components/abstract-form-dialog';
import { contactFormGroup, multiLangValidator } from '../../../../shared/pure';
import { EToasterType } from '../../../../shared/services/toaster';

/* eslint-disable @typescript-eslint/dot-notation */
import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'bgap-chain-form',
  templateUrl: './chain-form.component.html',
  styleUrls: ['./chain-form.component.scss'],
})
export class ChainFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public chain: IChain;
  public eImageType = EImageType;

  constructor(protected _injector: Injector) {
    super(_injector);
  }

  get logoFilePath(): string {
    return _get(this.chain, 'style.images.logo');
  }

  get headerFilePath(): string {
    return _get(this.chain, 'style.images.header');
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      description: this._formBuilder.group(
        {
          hu: [''],
          en: [''],
          de: [''],
        },
        { validators: multiLangValidator }
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

    if (this.chain) {
      this.dialogForm.patchValue(this.chain);
    } else {
      this.dialogForm.controls.isActive.patchValue(false);
    }
  }

  public submit(): void {
    if (this.dialogForm.valid) {
      if (_get(this.chain, '_id')) {
        this._dataService
          .updateChain(this.chain._id, this.dialogForm.value)
          .then(
            (): void => {
              this._toasterService.show(
                EToasterType.SUCCESS,
                '',
                'common.updateSuccessful'
              );
              this.close();
            },
            (err) => {
              console.error('CHAIN UPDATE ERROR', err);
            }
          );
      } else {
        this._dataService.insertChain(this.dialogForm.value).then(
          (): void => {
            this._toasterService.show(
              EToasterType.SUCCESS,
              '',
              'common.insertSuccessful'
            );
            this.close();
          },
          (err) => {
            console.error('CHAIN INSERT ERROR', err);
          }
        );
      }
    }
  }

  public logoUploadCallback = (imagePath: string, key: string): void => {
    this.dialogForm.controls.style['controls'].images['controls'][key].setValue(
      imagePath
    );

    // Update existing user's image
    if (_get(this.chain, '_id')) {
      this._dataService
        .updateChainImagePath(this.chain._id, key, imagePath)
        .then((): void => {
          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.imageUploadSuccess'
          );
        });
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageUploadSuccess'
      );
    }
  };

  public logoRemoveCallback = (key: string): void => {
    this.dialogForm.controls.style['controls'].images['controls'][key].setValue(
      ''
    );

    if (this.chain) {
      _set(this.chain, `style.images.${key}`, null);
    }

    // Update existing user's image
    if (_get(this.chain, '_id')) {
      this._dataService
        .updateChainImagePath(this.chain._id, key, null)
        .then((): void => {
          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.imageRemoveSuccess'
          );
        });
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageRemoveSuccess'
      );
    }
  };
}
