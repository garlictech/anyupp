import { iif } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { multiLangValidator } from '@bgap/admin/shared/utils';
import { catchGqlError } from '@bgap/admin/store/app-core';
import * as CrudApi from '@bgap/crud-gql/api';
import { KeyValue } from '@bgap/shared/types';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

const roleLevelValidator = (control: AbstractControl): unknown => {
  switch (control.value.role) {
    case CrudApi.Role.inactive:
    case CrudApi.Role.superuser:
      return null;
    case CrudApi.Role.chainadmin:
      return control.value.chainId ? null : { empty: true };
    case CrudApi.Role.groupadmin:
      return control.value.chainId && control.value.groupId
        ? null
        : { empty: true };
    case CrudApi.Role.unitadmin:
    case CrudApi.Role.staff:
      return control.value.chainId &&
        control.value.groupId &&
        control.value.unitId
        ? null
        : { empty: true };
    default:
      return null;
  }
};

@Injectable({ providedIn: 'root' })
export class RoleContextsFormService {
  constructor(
    private _store: Store,
    private _formBuilder: FormBuilder,
    private _crudSdk: CrudSdkService,
    private _translateService: TranslateService,
  ) {}

  public createRoleContextFormGroup() {
    return this._formBuilder.group(
      {
        name: this._formBuilder.group(
          {
            hu: [''],
            en: [''],
            de: [''],
          },
          { validators: multiLangValidator },
        ),
        role: [CrudApi.Role.inactive, [Validators.required]],
        chainId: [''],
        groupId: [''],
        unitId: [''],
      },
      { validators: roleLevelValidator },
    );
  }

  public getRoleOptions() {
    return Object.keys(CrudApi.Role).map(
      (key): KeyValue => ({
        key: CrudApi.Role[<keyof typeof CrudApi.Role>key].toString(),
        value: this._translateService.instant(
          `roles.${CrudApi.Role[<keyof typeof CrudApi.Role>key]}`,
        ),
      }),
    );
  }

  public saveForm$(
    formValue: CrudApi.CreateRoleContextInput | CrudApi.UpdateRoleContextInput,
    contextId: string,
    roleContextId?: string,
  ) {
    return iif(
      () => !roleContextId,
      this.createRoleContext$({
        ...(<CrudApi.CreateRoleContextInput>formValue),
        contextId,
      }),
      this.updateRoleContext$({
        ...formValue,
        id: roleContextId || '',
      }),
    );
  }

  public createRoleContext$(input: CrudApi.CreateRoleContextInput) {
    return this._crudSdk.sdk.CreateRoleContext({ input }).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public updateRoleContext$(input: CrudApi.UpdateRoleContextInput) {
    return this._crudSdk.sdk.UpdateRoleContext({ input }).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }
}
