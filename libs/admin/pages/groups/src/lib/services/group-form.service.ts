import { iif } from 'rxjs';
import { map } from 'rxjs/operators';

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

@Injectable({ providedIn: 'root' })
export class GroupFormService {
  constructor(
    private _store: Store,
    private _formBuilder: FormBuilder,
    private _crudSdk: CrudSdkService,
  ) {}

  public createGroupFormGroup() {
    return this._formBuilder.group({
      chainId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: this._formBuilder.group(
        {
          hu: [''],
          en: [''],
          de: [''],
        },
        { validators: multiLangValidator },
      ),
      currency: ['', [Validators.required]],
      ...contactFormGroup(),
      ...addressFormGroup(this._formBuilder),
    });
  }

  public saveForm$(
    formValue: CrudApi.CreateGroupInput | CrudApi.UpdateGroupInput,
    groupId?: string,
  ) {
    return iif(
      () => !groupId,
      this.createGroup$(<CrudApi.CreateGroupInput>formValue),
      this.updateGroup$({
        ...formValue,
        id: groupId || '',
      }),
    );
  }

  public createGroup$(input: CrudApi.CreateGroupInput) {
    return this._crudSdk.sdk.CreateGroup({ input }).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public updateGroup$(input: CrudApi.UpdateGroupInput) {
    return this._crudSdk.sdk.UpdateGroup({ input }).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }
}
