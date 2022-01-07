import { iif } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { contactFormGroup } from '@bgap/admin/shared/utils';
import { catchGqlError } from '@bgap/admin/store/app-core';
import * as CrudApi from '@bgap/crud-gql/api';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class AdminUserFormService {
  constructor(
    private _store: Store,
    private _formBuilder: FormBuilder,
    private _crudSdk: CrudSdkService,
  ) {}

  public createAdminUserFormGroup() {
    return this._formBuilder.group({
      name: ['', [Validators.required]],
      ...contactFormGroup(true),
      profileImage: [''], // Just for file upload!!
    });
  }

  public saveForm$(
    formValue: CrudApi.CreateAdminUserInput | CrudApi.UpdateAdminUserInput,
    adminUserId?: string,
  ) {
    return iif(
      () => !adminUserId,
      this.createAdminUser$({
        name: formValue.name || '',
        email: formValue.email || '',
        phone: formValue.phone || '',
      }),
      this.updateAdminUser$({
        ...formValue,
        id: adminUserId || '',
      }),
    );
  }

  public createAdminUser$(input: CrudApi.CreateAdminUserInput) {
    return this._crudSdk.sdk.CreateAdminUser({ input }).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public updateAdminUser$(input: CrudApi.UpdateAdminUserInput) {
    return this._crudSdk.sdk.UpdateAdminUser({ input }).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }

  public createAdminRoleContext$(input: CrudApi.CreateAdminRoleContextInput) {
    return this._crudSdk.sdk.CreateAdminRoleContext({ input }).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public deleteAdminRoleContext$(id: string) {
    return this._crudSdk.sdk
      .DeleteAdminRoleContext({
        input: {
          id,
        },
      })
      .pipe(
        catchGqlError(this._store),
        map(data => ({ data, type: 'update' })),
      );
  }
}
