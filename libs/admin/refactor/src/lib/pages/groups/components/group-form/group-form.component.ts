import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { Group } from '@bgap/domain';
import { KeyValue, UpsertResponse } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';
import { UntilDestroy } from '@ngneat/until-destroy';
import { select } from '@ngrx/store';

import { AbstractFormDialogComponent } from '../../../../shared/forms';
import { addressIsEmpty } from '../../../../shared/utils';
import { chainsSelectors } from '../../../../store/chains';
import { loggedUserSelectors } from '../../../../store/logged-user';
import { GroupFormService } from '../../services/group-form.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-group-form',
  templateUrl: './group-form.component.html',
})
export class GroupFormComponent
  extends AbstractFormDialogComponent
  implements OnInit
{
  public group!: Group;
  public chainOptions$: Observable<KeyValue[]>;
  public currencyOptions: KeyValue[] = [];

  constructor(
    protected override _injector: Injector,
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
        .subscribe((selectedChainId: string | undefined | null) => {
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

  public submit() {
    if (this.dialogForm?.valid) {
      this.setWorking$(true)
        .pipe(
          switchMap(() =>
            this._groupFormService.saveForm$(
              {
                ...this.dialogForm?.value,
                address: addressIsEmpty(this.dialogForm?.value.address)
                  ? null
                  : this.dialogForm?.value.address,
              },
              this.group?.id,
            ),
          ),
          tap(() => this.setWorking$(false)),
        )
        .subscribe((response: UpsertResponse<unknown>) => {
          this._toasterService.showSimpleSuccess(response.type);

          this.close();
        });
    }
  }
}
