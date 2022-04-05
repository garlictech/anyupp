import { iif } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { catchGqlError } from '@bgap/admin/store/app-core';
import {
  maxSelectionValidator,
  multiLangValidator,
  notEmptyArray,
} from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { defaultServingMode } from '@bgap/shared/types';
import { Store } from '@ngrx/store';
import { ProductComponentCollectionService } from '@bgap/admin/store/product-components';
import { ProductComponentSetCollectionService } from '@bgap/admin/store/product-component-sets';

@Injectable({ providedIn: 'root' })
export class ModifiersAndExtrasFormService {
  constructor(
    private _store: Store,
    private _formBuilder: FormBuilder,
    private _productComponentCollectionService: ProductComponentCollectionService,
    private _productComponentSetCollectionService: ProductComponentSetCollectionService,
  ) {}

  public createProductComponentFormGroup(
    uniqueNameValidator: (lang: keyof CrudApi.LocalizedItem) => ValidatorFn,
  ) {
    return this._formBuilder.group({
      chainId: ['', [Validators.required]],
      name: this._formBuilder.group(
        {
          hu: ['', [Validators.maxLength(40), uniqueNameValidator('hu')]],
          en: ['', [Validators.maxLength(40), uniqueNameValidator('en')]],
          de: ['', [Validators.maxLength(40), uniqueNameValidator('de')]],
        },
        { validators: multiLangValidator },
      ),
      description: [''],
      allergens: [[]],
      soldOut: [false],
    });
  }

  public createProductComponentSetFormGroup() {
    return this._formBuilder.group(
      {
        chainId: ['', [Validators.required]],
        type: ['', [Validators.required]],
        maxSelection: [''],
        name: this._formBuilder.group(
          {
            hu: ['', [Validators.maxLength(40)]],
            en: ['', [Validators.maxLength(40)]],
            de: ['', [Validators.maxLength(40)]],
          },
          { validators: multiLangValidator },
        ),
        description: ['', [Validators.required]],
        supportedServingModes: [[defaultServingMode], [notEmptyArray]],
        items: [[]],
      },
      { validators: maxSelectionValidator },
    );
  }

  public addComponentToList(
    dialogForm: FormGroup,
    componentForm: FormGroup,
  ): void {
    const componentIdsArr: string[] = dialogForm.controls['items'].value;
    componentIdsArr.push(componentForm.value.productComponentId);

    dialogForm.controls['items'].setValue(componentIdsArr);
    componentForm.patchValue({ productComponentId: '' });
  }

  public removeComponentFromList(
    dialogForm: FormGroup,
    productComponentId: string,
  ): void {
    const componentsArr: string[] = (
      dialogForm.controls['items'].value || []
    ).filter((i: string) => i !== productComponentId);

    dialogForm.controls['items'].setValue(componentsArr);
  }

  public saveComponentForm$(
    formValue:
      | CrudApi.CreateProductComponentInput
      | CrudApi.UpdateProductComponentInput,
    componentId?: string,
  ) {
    return iif(
      () => !componentId,
      this.createProductComponent$(
        <CrudApi.CreateProductComponentInput>formValue,
      ),
      this.updateProductComponent$({
        ...formValue,
        id: componentId || '',
      }),
    );
  }

  public createProductComponent$(input: CrudApi.CreateProductComponentInput) {
    return this._productComponentCollectionService.add$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public updateProductComponent$(input: CrudApi.UpdateProductComponentInput) {
    return this._productComponentCollectionService.update$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }

  public saveComponentSetForm$(
    formValue:
      | CrudApi.CreateProductComponentSetInput
      | CrudApi.UpdateProductComponentSetInput,
    componentId?: string,
  ) {
    return iif(
      () => !componentId,
      this.createProductComponentSet$(
        <CrudApi.CreateProductComponentSetInput>formValue,
      ),
      this.updateProductComponentSet$({
        ...formValue,
        id: componentId || '',
      }),
    );
  }

  public createProductComponentSet$(
    input: CrudApi.CreateProductComponentSetInput,
  ) {
    return this._productComponentSetCollectionService.add$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public updateProductComponentSet$(
    input: CrudApi.UpdateProductComponentSetInput,
  ) {
    return this._productComponentSetCollectionService.update$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }
}
