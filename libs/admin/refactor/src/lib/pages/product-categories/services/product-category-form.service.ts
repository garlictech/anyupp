import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { multiLangValidator } from '../../../shared/utils';

import * as CrudApi from '@bgap/crud-gql/api';
import { Store } from '@ngrx/store';
import { iif } from 'rxjs';
import { catchGqlError } from '../../../store/app-core';
import { map } from 'rxjs/operators';
import { ProductCategoryCollectionService } from '../../../store/product-categories';

@Injectable({ providedIn: 'root' })
export class ProductCategoryFormService {
  constructor(
    private _store: Store,
    private _formBuilder: FormBuilder,
    private _productCategoryCollectionService: ProductCategoryCollectionService,
  ) {}

  public createProductCategoryFormGroup() {
    return this._formBuilder.group({
      name: this._formBuilder.group(
        {
          hu: [''],
          en: [''],
          de: [''],
        },
        { validators: multiLangValidator },
      ),
      description: this._formBuilder.group(
        {
          hu: [''],
          en: [''],
          de: [''],
        },
        { validators: multiLangValidator },
      ),
      image: [''],
    });
  }

  public saveForm$(
    formValue:
      | CrudApi.CreateProductCategoryInput
      | CrudApi.UpdateProductCategoryInput,
    productCategoryId?: string,
  ) {
    return iif(
      () => !productCategoryId,
      this.createProductCategory$(
        <CrudApi.CreateProductCategoryInput>formValue,
      ),
      this.updateProductCategory$({
        ...formValue,
        id: productCategoryId || '',
      }),
    );
  }

  public createProductCategory$(input: CrudApi.CreateProductCategoryInput) {
    return this._productCategoryCollectionService.add$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public updateProductCategory$(input: CrudApi.UpdateProductCategoryInput) {
    return this._productCategoryCollectionService.update$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }

  public updateImageStyles$(id: string, image: string | null) {
    return this.updateProductCategory$({
      id,
      image,
    });
  }
}
