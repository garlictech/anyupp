import { combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { IAdminRoleEntity, IChain, IKeyValue } from '@bgap/shared/types';

import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-form-chain-admin-role',
  templateUrl: './form-chain-admin-role.component.html',
})
export class FormChainAdminRoleComponent implements OnInit, OnDestroy {
  @Input() control!: FormGroup;
  public chainOptions: IKeyValue[] = [];
  public entitySelector: FormGroup;
  public assignedChains: IChain[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private _store: Store<any>, private _formBuilder: FormBuilder) {
    this.chainOptions = [];
    this.entitySelector = this._formBuilder.group({
      chainId: [''],
    });
  }

  ngOnInit(): void {
    combineLatest([
      this._store.pipe(select(chainsSelectors.getAllChains)),
      (<FormGroup>this.control.get('entities')).valueChanges.pipe(
        startWith(this.control.value.entities),
      ),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([chains, entities]: [IChain[], IAdminRoleEntity[]]): void => {
        this.chainOptions = [];
        this.assignedChains = [];

        chains.forEach((chain: IChain): void => {
          if (!entities.map((e): string => e.chainId).includes(chain.id)) {
            this.chainOptions.push({
              key: chain.id,
              value: chain.name,
            });
          } else {
            this.assignedChains.push(chain);
          }
        });
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public addChain(): void {
    const arr = [...this.control.value.entities];
    arr.push({
      chainId: this.entitySelector.value.chainId,
    });
    (<FormGroup>this.control.get('entities')).setValue(arr);

    this.entitySelector.patchValue({
      chainId: '',
    });
  }

  public removeChain(idx: number): void {
    const arr = [...this.control.value.entities];
    arr.splice(idx, 1);

    (<FormGroup>this.control.get('entities')).setValue(arr);
  }
}
