import { iif } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import {
  CreateProductCategoryInput,
  UpdateProductCategoryInput,
} from '@bgap/domain';
import { Store } from '@ngrx/store';

import { multiLangValidator } from '../../../shared/utils';
import { catchGqlError } from '../../../store/app-core';
import { ProductCategoryCollectionService } from '../../../store/product-categories';

@Injectable({ providedIn: 'root' })
export class ProductCategoryFormService {
  constructor(
    private _store: Store,
    private _formBuilder: UntypedFormBuilder,
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
    formValue: CreateProductCategoryInput | UpdateProductCategoryInput,
    productCategoryId?: string,
  ) {
    return iif(
      () => !productCategoryId,
      this.createProductCategory$(<CreateProductCategoryInput>formValue),
      this.updateProductCategory$({
        ...formValue,
        id: productCategoryId || '',
      }),
    );
  }

  public createProductCategory$(input: CreateProductCategoryInput) {
    return this._productCategoryCollectionService.add$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public updateProductCategory$(input: UpdateProductCategoryInput) {
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
