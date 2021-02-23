import { get as _get } from 'lodash-es';
import { combineLatest } from 'rxjs';
import { startWith, take } from 'rxjs/operators';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import {
  IAdminRoleEntity,
  IAssignedEntityNames,
  IChain,
  IGroup,
  IKeyValue,
} from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-form-group-admin-role',
  templateUrl: './form-group-admin-role.component.html',
})
export class FormGroupAdminRoleComponent implements OnInit, OnDestroy {
  @Input() control!: FormGroup;
  public groupOptions: IKeyValue[];
  public chainOptions: IKeyValue[];
  public entitySelector: FormGroup;
  public assignedGroups: IAssignedEntityNames[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private _store: Store<any>, private _formBuilder: FormBuilder) {
    this.groupOptions = [];
    this.chainOptions = [];
    this.assignedGroups = [];
    this.entitySelector = this._formBuilder.group({
      chainId: [''],
      groupId: [''],
    });
  }

  ngOnInit(): void {
    combineLatest([
      this._store.pipe(select(chainsSelectors.getAllChains)),
      this._store.pipe(select(groupsSelectors.getAllGroups)),
      (<FormGroup>this.control.get('entities')).valueChanges.pipe(
        startWith(this.control.value.entities),
      ),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(
        ([chains, groups, entities]: [
          IChain[],
          IGroup[],
          IAdminRoleEntity[],
        ]): void => {
          // Fill the chain list
          this.chainOptions = [];
          chains.forEach((chain: IChain): void => {
            this.chainOptions.push({
              key: chain._id,
              value: chain.name,
            });
          });

          // Fill the assigned entity list
          this.assignedGroups = [];
          entities.forEach((entity: IAdminRoleEntity): void => {
            this.assignedGroups.push({
              chainName: _get(
                chains.find((c): boolean => c._id === entity.chainId),
                'name',
              ),
              groupName: _get(
                groups.find((g): boolean => g._id === entity.groupId),
                'name',
              ),
            });
          });
        },
      );

    combineLatest([
      this.entitySelector.valueChanges,
      (<FormGroup>this.control.get('entities')).valueChanges.pipe(
        startWith(this.control.value.entities),
      ),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(
        ([selectorValue, entities]: [
          IAdminRoleEntity,
          IAdminRoleEntity[],
        ]): void => {
          this._store
            .pipe(
              select(groupsSelectors.getGroupsByChainId(selectorValue.chainId)),
            )
            .pipe(take(1))
            .subscribe((groups): void => {
              this.groupOptions = [];

              groups.forEach((group: IGroup): void => {
                if (
                  !entities
                    .map((e): string => e.groupId || '')
                    .includes(group._id)
                ) {
                  this.groupOptions.push({
                    key: group._id,
                    value: group.name,
                  });
                }
              });
            });
        },
      );
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public addGroup(): void {
    const arr = [...this.control.value.entities];
    arr.push({
      chainId: this.entitySelector.value.chainId,
      groupId: this.entitySelector.value.groupId,
    });
    (<FormGroup>this.control.get('entities')).setValue(arr);

    this.entitySelector.patchValue({
      chainId: '',
      groupId: '',
    });
  }

  public removeGroup(idx: number): void {
    const arr = [...this.control.value.entities];
    arr.splice(idx, 1);

    (<FormGroup>this.control.get('entities')).setValue(arr);
  }
}
