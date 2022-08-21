import { iif } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  CreateProductComponentInput,
  CreateProductComponentSetInput,
  UpdateProductComponentInput,
  UpdateProductComponentSetInput,
} from '@bgap/domain';
import { defaultServingMode } from '@bgap/shared/types';
import { Store } from '@ngrx/store';

import {
  maxSelectionValidator,
  multiLangValidator,
  notEmptyArray,
} from '../../../shared/utils';
import { catchGqlError } from '../../../store/app-core';
import { ProductComponentSetCollectionService } from '../../../store/product-component-sets';
import { ProductComponentCollectionService } from '../../../store/product-components';

@Injectable({ providedIn: 'root' })
export class ModifiersAndExtrasFormService {
  constructor(
    private _store: Store,
    private _formBuilder: UntypedFormBuilder,
    private _productComponentCollectionService: ProductComponentCollectionService,
    private _productComponentSetCollectionService: ProductComponentSetCollectionService,
  ) {}

  public createProductComponentFormGroup() {
    return this._formBuilder.group({
      ownerEntity: ['', [Validators.required]],
      name: this._formBuilder.group(
        {
          hu: ['', [Validators.maxLength(40)]],
          en: ['', [Validators.maxLength(40)]],
          de: ['', [Validators.maxLength(40)]],
        },
        { validators: multiLangValidator },
      ),
      description: [''],
      allergens: [[]],
    });
  }

  public createProductComponentSetFormGroup() {
    return this._formBuilder.group(
      {
        ownerEntity: ['', [Validators.required]],
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
    dialogForm: UntypedFormGroup,
    componentForm: UntypedFormGroup,
  ) {
    const componentIdsArr: string[] = dialogForm.controls['items'].value;
    componentIdsArr.push(componentForm.value.productComponentId);

    dialogForm.controls['items'].setValue(componentIdsArr);
    componentForm.patchValue({ productComponentId: '' });
  }

  public removeComponentFromList(
    dialogForm: UntypedFormGroup,
    productComponentId: string,
  ) {
    const componentsArr: string[] = (
      dialogForm.controls['items'].value || []
    ).filter((i: string) => i !== productComponentId);

    dialogForm.controls['items'].setValue(componentsArr);
  }

  public saveComponentForm$(
    formValue: CreateProductComponentInput | UpdateProductComponentInput,
    componentId?: string,
  ) {
    return iif(
      () => !componentId,
      this.createProductComponent$(<CreateProductComponentInput>formValue),
      this.updateProductComponent$({
        ...formValue,
        id: componentId || '',
      }),
    );
  }

  public createProductComponent$(input: CreateProductComponentInput) {
    return this._productComponentCollectionService.add$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public updateProductComponent$(input: UpdateProductComponentInput) {
    return this._productComponentCollectionService.update$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }

  public saveComponentSetForm$(
    formValue: CreateProductComponentSetInput | UpdateProductComponentSetInput,
    componentId?: string,
  ) {
    return iif(
      () => !componentId,
      this.createProductComponentSet$(
        <CreateProductComponentSetInput>formValue,
      ),
      this.updateProductComponentSet$({
        ...formValue,
        id: componentId || '',
      }),
    );
  }

  public createProductComponentSet$(input: CreateProductComponentSetInput) {
    return this._productComponentSetCollectionService.add$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public updateProductComponentSet$(input: UpdateProductComponentSetInput) {
    return this._productComponentSetCollectionService.update$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }
}
