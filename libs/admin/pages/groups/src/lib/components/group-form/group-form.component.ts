import { NGXLogger } from 'ngx-logger';
import { take } from 'rxjs/operators';
import { CrudSdkService } from '@bgap/admin/shared/data-access/data';

import * as CrudApi from '@bgap/crud-gql/api';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import {
  addressFormGroup,
  contactFormGroup,
  EToasterType,
  multiLangValidator,
} from '@bgap/admin/shared/utils';
import { IKeyValue } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-group-form',
  templateUrl: './group-form.component.html',
})
export class GroupFormComponent
  extends AbstractFormDialogComponent
  implements OnInit, OnDestroy {
  public group!: CrudApi.Group;
  public chainOptions: IKeyValue[] = [];
  public currencyOptions: IKeyValue[] = [];

  constructor(
    protected _injector: Injector,
    private _store: Store,
    private _logger: NGXLogger,
    private _changeDetectorRef: ChangeDetectorRef,
    private _crudSdk: CrudSdkService,
  ) {
    super(_injector);

    this.dialogForm = this._formBuilder.group({
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

  ngOnInit(): void {
    if (this.group) {
      this.dialogForm.patchValue(cleanObject(this.group));
    } else {
      // Patch ChainId
      this._store
        .pipe(select(loggedUserSelectors.getSelectedChainId), take(1))
        .subscribe((selectedChainId: string | undefined | null): void => {
          if (selectedChainId) {
            this.dialogForm?.patchValue({ chainId: selectedChainId });
          }
        });
    }

    this._store
      .pipe(select(chainsSelectors.getAllChains), untilDestroyed(this))
      .subscribe((chains: CrudApi.Chain[]): void => {
        this.chainOptions = chains.map(
          (chain): IKeyValue => ({
            key: chain.id,
            value: chain.name,
          }),
        );

        this._changeDetectorRef.detectChanges();
      });

    this.currencyOptions = ['EUR', 'HUF'].map(
      (currency): IKeyValue => ({
        key: currency,
        value: currency,
      }),
    );

    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public async submit(): Promise<void> {
    if (this.dialogForm?.valid) {
      if (this.group?.id) {
        try {
          await this._crudSdk.sdk
            .UpdateGroup({
              input: {
                id: this.group.id,
                ...this.dialogForm.value,
              },
            })
            .toPromise();

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.updateSuccessful',
          );

          this.close();
        } catch (error) {
          this._logger.error(`GROUP UPDATE ERROR: ${JSON.stringify(error)}`);
        }
      } else {
        try {
          await this._crudSdk.sdk
            .CreateGroup({ input: this.dialogForm.value })
            .toPromise();

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.insertSuccessful',
          );
          this.close();
        } catch (error) {
          this._logger.error(`GROUP INSERT ERROR: ${JSON.stringify(error)}`);
        }
      }
    }
  }
}
