import { iif } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { contactFormGroup } from '../../../shared/utils';
import { catchGqlError } from '../../../store/app-core';
import * as CrudApi from '@bgap/crud-gql/api';
import { Store } from '@ngrx/store';
import { AdminUserCollectionService } from '../../../store/admin-users';

@Injectable({ providedIn: 'root' })
export class AdminUserFormService {
  constructor(
    private _store: Store,
    private _formBuilder: FormBuilder,
    private _adminUserCollectionService: AdminUserCollectionService,
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
    return this._adminUserCollectionService.add$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public updateAdminUser$(input: CrudApi.UpdateAdminUserInput) {
    return this._adminUserCollectionService.update$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }
}
