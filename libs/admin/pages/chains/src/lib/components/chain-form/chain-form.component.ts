import * as fp from 'lodash/fp';
import { NGXLogger } from 'ngx-logger';

/* eslint-disable @typescript-eslint/dot-notation */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import {
  addressFormGroup,
  contactFormGroup,
  EToasterType,
  multiLangValidator,
} from '@bgap/admin/shared/utils';
import { EImageType, IChain } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-chain-form',
  templateUrl: './chain-form.component.html',
  styleUrls: ['./chain-form.component.scss'],
})
export class ChainFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public chain!: IChain;
  public eImageType = EImageType;

  constructor(
    protected _injector: Injector,
    private _changeDetectorRef: ChangeDetectorRef,
    private _amplifyDataService: AmplifyDataService,
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

  get logoImage(): string | undefined {
    return this.chain?.style?.images?.logo;
  }

  get headerImage(): string | undefined {
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
          await this._amplifyDataService.update<IChain>(
            'getChain',
            'updateChain',
            this.chain.id,
            () => this.dialogForm.value,
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
          await this._amplifyDataService.create(
            'createChain',
            this.dialogForm?.value,
          );

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
        await this._amplifyDataService.update<IChain>(
          'getChain',
          'updateChain',
          this.chain.id,
          (data: unknown) =>
            fp.set(`style.images.${param}`, image, <IChain>data),
        );

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
      await this._amplifyDataService.update<IChain>(
        'getChain',
        'updateChain',
        this.chain.id,
        (data: unknown) => fp.set(`style.images.${param}`, null, <IChain>data),
      );
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageRemoveSuccess',
      );
    }
  };
}
