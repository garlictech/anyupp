import { combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { IAdminRoleEntity, IChain, IKeyValue } from '@bgap/shared/types';
import { chainListSelectors } from '../../../../../../store/selectors';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-form-chain-admin-role',
  templateUrl: './form-chain-admin-role.component.html',
})
export class FormChainAdminRoleComponent implements OnInit, OnDestroy {
  @Input() control: FormControl;
  public chainOptions: IKeyValue[];
  public entitySelector: FormGroup;
  public assignedChains: IChain[];

  constructor(
    private _store: Store<IState>,
    private _formBuilder: FormBuilder
  ) {
    this.chainOptions = [];
    this.entitySelector = this._formBuilder.group({
      chainId: [''],
    });
  }

  ngOnInit(): void {
    combineLatest([
      this._store.pipe(select(chainListSelectors.getAllChains)),
      this.control['controls'].entities.valueChanges.pipe(
        startWith(this.control.value.entities)
      ),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([chains, entities]: [IChain[], IAdminRoleEntity[]]): void => {
        this.chainOptions = [];
        this.assignedChains = [];

        chains.forEach((chain: IChain): void => {
          if (!entities.map((e): string => e.chainId).includes(chain._id)) {
            this.chainOptions.push({
              key: chain._id,
              value: chain.name,
            });
          } else {
            this.assignedChains.push(chain);
          }
        });
      });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public addChain(): void {
    const arr = [...this.control.value.entities];
    arr.push({
      chainId: this.entitySelector.value.chainId,
    });
    this.control['controls'].entities.setValue(arr);

    this.entitySelector.patchValue({
      chainId: '',
    });
  }

  public removeChain(idx: number): void {
    const arr = [...this.control.value.entities];
    arr.splice(idx, 1);

    this.control['controls'].entities.setValue(arr);
  }
}
