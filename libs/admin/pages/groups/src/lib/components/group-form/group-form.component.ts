import { get as _get } from 'lodash-es';
import { take } from 'rxjs/operators';

import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import {
  EToasterType,
  multiLangValidator,
  contactFormGroup,
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

  private _store: Store<any>;
  private chains: IChain[] = [];

  constructor(protected _injector: Injector) {
    super(_injector);

    this._store = this._injector.get(Store);
    this._store
      .pipe(select(chainsSelectors.getAllChains), untilDestroyed(this))
      .subscribe((chains: IChain[]): void => {
        this.chains = chains;

        this.chainOptions = this.chains.map(
          (chain): IKeyValue => ({
            key: chain._id,
            value: chain.name,
          })
        );
      });

    this.currencyOptions = ['EUR', 'HUF'].map(
      (currency): IKeyValue => ({
        key: currency,
        value: currency,
      })
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
        { validators: multiLangValidator }
      ),
      currency: ['', [Validators.required]],
      ...contactFormGroup(this._formBuilder),
    });

    if (this.group) {
      this.dialogForm.patchValue(this.group);
    } else {
      // Patch ChainId
      this._store
        .pipe(select(loggedUserSelectors.getSelectedChainId), take(1))
        .subscribe((selectedChainId: string | undefined | null): void => {
          if (selectedChainId) {
            this.dialogForm?.controls.chainId.patchValue(selectedChainId);
          }
        });
    }
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public submit(): void {
    if (this.dialogForm?.valid) {
      if (_get(this.group, '_id')) {
        this._dataService
          .updateGroup(this.group._id, this.dialogForm?.value)
          .then(
            (): void => {
              this._toasterService.show(
                EToasterType.SUCCESS,
                '',
                'common.updateSuccessful'
              );
              this.close();
            },
            err => {
              console.error('GROUP UPDATE ERROR', err);
            }
          );
      } else {
        this._dataService.insertGroup(this.dialogForm?.value).then(
          (): void => {
            this._toasterService.show(
              EToasterType.SUCCESS,
              '',
              'common.insertSuccessful'
            );
            this.close();
          },
          err => {
            console.error('GROUP INSERT ERROR', err);
          }
        );
      }
    }
  }
}
