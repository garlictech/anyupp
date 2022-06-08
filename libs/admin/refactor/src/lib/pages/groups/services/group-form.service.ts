import { iif } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateGroupInput, UpdateGroupInput } from '@bgap/domain';
import { Store } from '@ngrx/store';

import {
  addressFormGroup,
  contactFormGroup,
  multiLangValidator,
} from '../../../shared/utils';
import { catchGqlError } from '../../../store/app-core';
import { GroupCollectionService } from '../../../store/groups';

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
    formValue: CreateGroupInput | UpdateGroupInput,
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
      this.createGroup$(<CreateGroupInput>formValue),
      this.updateGroup$({
        ...formValue,
        id: groupId || '',
      }),
    );
  }

  public createGroup$(input: CreateGroupInput) {
    return this._groupCollectionService.add$<CreateGroupInput>(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public updateGroup$(input: UpdateGroupInput) {
    return this._groupCollectionService.update$<UpdateGroupInput>(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }
}
