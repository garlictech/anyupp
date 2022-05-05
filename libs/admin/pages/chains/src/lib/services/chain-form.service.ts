import { cloneDeep } from 'lodash/fp';
import { iif } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  addressFormGroup,
  contactFormGroup,
  multiLangValidator,
} from '@bgap/admin/shared/utils';
import { catchGqlError } from '@bgap/admin/store/app-core';
import { ChainCollectionService } from '@bgap/admin/store/chains';
import * as CrudApi from '@bgap/crud-gql/api';
import { filterNullish } from '@bgap/shared/utils';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class ChainFormService {
  constructor(
    private _store: Store,
    private _formBuilder: FormBuilder,
    private _chainCollectionService: ChainCollectionService,
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
          // backgroundLight: [],
          // backgroundDark: [],
          // textDark: [],
          // textLight: [],
          // borderDark: [],
          // borderLight: [],
          // disabled: [],
          // primary: [],
          // secondary: [],
          // indicator: [],
          button: ['#30bf60', [Validators.required]],
          buttonText: ['#ffffff', [Validators.required]],
          icon: ['#30bf60', [Validators.required]],
          highlight: ['#30bf60', [Validators.required]],
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
    if (formValue.address) {
      formValue.address = {
        ...formValue.address,
        location: {
          lat: 0,
          lng: 0,
        },
      };
    }

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
    return this._chainCollectionService
      .add$<CrudApi.CreateChainInput>(input)
      .pipe(
        catchGqlError(this._store),
        map(data => ({ data, type: 'insert' })),
      );
  }

  public updateChain$(input: CrudApi.UpdateChainInput) {
    return this._chainCollectionService
      .update$<CrudApi.UpdateChainInput>(input)
      .pipe(
        catchGqlError(this._store),
        map(data => ({ data, type: 'update' })),
      );
  }

  public updateChainImageStyles$(
    chainId: string,
    param: string,
    image?: string,
  ) {
    return this._chainCollectionService.getByKey$(chainId, true, true).pipe(
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

        return this._chainCollectionService.update$<CrudApi.UpdateChainInput>({
          id: _data.id,
          style: _data.style,
        });
      }),
      catchGqlError(this._store),
    );
  }
}
