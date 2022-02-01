import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { chainsSelectors } from '@bgap/admin/store/chains';
import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { addressIsEmpty } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { KeyValue, UpsertResponse } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';
import { UntilDestroy } from '@ngneat/until-destroy';
import { select } from '@ngrx/store';

import { GroupFormService } from '../../services/group-form.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-group-form',
  templateUrl: './group-form.component.html',
})
export class GroupFormComponent
  extends AbstractFormDialogComponent
  implements OnInit, OnDestroy
{
  public group!: CrudApi.Group;
  public chainOptions$: Observable<KeyValue[]>;
  public currencyOptions: KeyValue[] = [];

  constructor(
    protected _injector: Injector,
    private _changeDetectorRef: ChangeDetectorRef,
    private _groupFormService: GroupFormService,
  ) {
    super(_injector);

    this.dialogForm = this._groupFormService.createGroupFormGroup();

    this.chainOptions$ = this._store.select(
      chainsSelectors.getAllChainOptions(),
    );
  }

  ngOnInit() {
    if (this.group) {
      this.dialogForm?.patchValue(cleanObject(this.group));
    } else {
      this._store
        .pipe(select(loggedUserSelectors.getSelectedChainId), take(1))
        .subscribe((selectedChainId: string | undefined | null): void => {
          if (selectedChainId) {
            this.dialogForm?.patchValue({ chainId: selectedChainId });
          }
        });
    }

    this.currencyOptions = ['EUR', 'HUF'].map(currency => ({
      key: currency,
      value: currency,
    }));

    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public submit() {
    if (this.dialogForm?.valid) {
      this._groupFormService
        .saveForm$(
          {
            ...this.dialogForm.value,
            address: addressIsEmpty(this.dialogForm.value.address)
              ? null
              : this.dialogForm.value.address,
          },
          this.group?.id,
        )
        .subscribe((response: UpsertResponse<unknown>) => {
          this._toasterService.showSimpleSuccess(response.type);

          this.close();
        });
    }
  }
}
