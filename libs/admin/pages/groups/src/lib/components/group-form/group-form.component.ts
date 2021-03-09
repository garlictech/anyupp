import { NGXLogger } from 'ngx-logger';
import { take } from 'rxjs/operators';

import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Mutations } from '@bgap/admin/amplify';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import {
  addressFormGroup, clearDbProperties, contactFormGroup, EToasterType, multiLangValidator
} from '@bgap/admin/shared/utils';
import { IChain, IGroup, IKeyValue } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-group-form',
  templateUrl: './group-form.component.html',
})
export class GroupFormComponent
  extends AbstractFormDialogComponent
  implements OnInit, OnDestroy {
  public group!: IGroup;
  public chainOptions: IKeyValue[] = [];
  public currencyOptions: IKeyValue[] = [];

  private _amplifyDataService: AmplifyDataService;
  private _logger: NGXLogger;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _store: Store<any>;
  private chains: IChain[] = [];

  constructor(protected _injector: Injector) {
    super(_injector);

    this._amplifyDataService = this._injector.get(AmplifyDataService);
    this._logger = this._injector.get(NGXLogger);

    this._store = this._injector.get(Store);
    this._store
      .pipe(select(chainsSelectors.getAllChains), untilDestroyed(this))
      .subscribe((chains: IChain[]): void => {
        this.chains = chains;

        this.chainOptions = this.chains.map(
          (chain): IKeyValue => ({
            key: chain.id,
            value: chain.name,
          }),
        );
      });

    this.currencyOptions = ['EUR', 'HUF'].map(
      (currency): IKeyValue => ({
        key: currency,
        value: currency,
      }),
    );
  }

  ngOnInit(): void {
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
      ...contactFormGroup(this._formBuilder),
      ...addressFormGroup(this._formBuilder),
    });

    if (this.group) {
      this.dialogForm.patchValue(clearDbProperties(this.group));
    } else {
      // Patch ChainId
      this._store
        .pipe(select(loggedUserSelectors.getSelectedChainId), take(1))
        .subscribe((selectedChainId: string | undefined | null): void => {
          if (selectedChainId) {
            this.dialogForm?.controls.chainId.patchValue(selectedChainId);
          }
        });
    }
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public async submit(): Promise<void> {
    if (this.dialogForm?.valid) {
      if (this.group?.id) {
        try {
          await this._amplifyDataService.update('getGroup', 'updateGroup',
            this.group.id,
            () => this.dialogForm.value
          );

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
          await this._amplifyDataService.create('createGroup', this.dialogForm?.value);

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
