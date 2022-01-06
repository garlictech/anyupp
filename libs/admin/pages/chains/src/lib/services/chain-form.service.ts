import { iif } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { cloneDeep } from 'lodash/fp';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { catchGqlError } from '@bgap/admin/store/app-core';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import {
  addressFormGroup,
  contactFormGroup,
  multiLangValidator,
} from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { Store } from '@ngrx/store';
import { filterNullish } from '@bgap/shared/utils';

@Injectable({ providedIn: 'root' })
export class ChainFormService {
  constructor(
    private _store: Store,
    private _formBuilder: FormBuilder,
    private _crudSdk: CrudSdkService,
  ) {}

  public createChainFormGroup() {
    return this._formBuilder.group({
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
          primary: ['', [Validators.required]],
          secondary: ['', [Validators.required]],
        }),
        images: this._formBuilder.group({
          logo: [''],
          header: [''],
        }),
      }),
    });
  }

  public saveForm$(
    formValue: CrudApi.CreateChainInput | CrudApi.UpdateChainInput,
    chainId?: string,
  ) {
    return iif(
      () => !chainId,
      this.createChain$(<CrudApi.CreateChainInput>formValue),
      this.updateChain$({
        ...formValue,
        id: chainId || '',
      }),
    );
  }

  public createChain$(input: CrudApi.CreateChainInput) {
    return this._crudSdk.sdk.CreateChain({ input }).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public updateChain$(input: CrudApi.UpdateChainInput) {
    return this._crudSdk.sdk.UpdateChain({ input }).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }

  public updateChainImageStyles$(
    chainId: string,
    param: string,
    image?: string,
  ) {
    return this._crudSdk.sdk
      .GetChain({
        id: chainId,
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
  }
}
