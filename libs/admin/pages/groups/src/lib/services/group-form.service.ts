import { iif } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  addressFormGroup,
  contactFormGroup,
  multiLangValidator,
} from '@bgap/admin/shared/utils';
import { catchGqlError } from '@bgap/admin/store/app-core';
import { GroupCollectionService } from '@bgap/admin/store/groups';
import * as CrudApi from '@bgap/crud-gql/api';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class GroupFormService {
  constructor(
    private _store: Store,
    private _formBuilder: FormBuilder,
    private _groupCollectionService: GroupCollectionService,
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
      () => !groupId,
      this.createGroup$(<CrudApi.CreateGroupInput>formValue),
      this.updateGroup$({
        ...formValue,
        id: groupId || '',
      }),
    );
  }

  public createGroup$(input: CrudApi.CreateGroupInput) {
    return this._groupCollectionService
      .add$<CrudApi.CreateGroupInput>(input)
      .pipe(
        catchGqlError(this._store),
        map(data => ({ data, type: 'insert' })),
      );
  }

  public updateGroup$(input: CrudApi.UpdateGroupInput) {
    return this._groupCollectionService
      .update$<CrudApi.UpdateGroupInput>(input)
      .pipe(
        catchGqlError(this._store),
        map(data => ({ data, type: 'update' })),
      );
  }
}
