import { get as _get } from 'lodash-es';
import { combineLatest } from 'rxjs';
import { startWith, take } from 'rxjs/operators';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import { IAdminRoleEntity, IAssignedEntityNames, IChain, IGroup, IKeyValue, IUnit } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-form-staff-role',
  templateUrl: './form-staff-role.component.html',
})
export class FormStaffRoleComponent implements OnInit, OnDestroy {
  @Input() control: FormControl;
  public groupOptions: IKeyValue[];
  public chainOptions: IKeyValue[];
  public unitOptions: IKeyValue[];
  public entitySelector: FormGroup;
  public assignedUnits: IAssignedEntityNames[];

  constructor(
    private _store: Store<any>,
    private _formBuilder: FormBuilder,
  ) {
    this.groupOptions = [];
    this.chainOptions = [];
    this.entitySelector = this._formBuilder.group({
      chainId: [''],
      groupId: [''],
      unitId: [''],
    });
  }

  ngOnInit(): void {
    combineLatest([
      this._store.pipe(select(chainsSelectors.getAllChains)),
      this._store.pipe(select(groupsSelectors.getAllGroups)),
      this._store.pipe(select(unitsSelectors.getAllUnits)),
      this.control['controls'].entities.valueChanges.pipe(
        startWith(this.control.value.entities)
      ),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(
        ([chains, groups, units, entities]: [
          IChain[],
          IGroup[],
          IUnit[],
          IAdminRoleEntity[]
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
          this.assignedUnits = [];
          entities.forEach((entity: IAdminRoleEntity): void => {
            this.assignedUnits.push({
              chainName: _get(
                chains.find((c): boolean => c._id === entity.chainId),
                'name'
              ),
              groupName: _get(
                groups.find((g): boolean => g._id === entity.groupId),
                'name'
              ),
              unitName: _get(
                units.find((u): boolean => u._id === entity.unitId),
                'name'
              ),
            });
          });
        }
      );

    combineLatest([
      this.entitySelector.valueChanges,
      this.control['controls'].entities.valueChanges.pipe(
        startWith(this.control.value.entities)
      ),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(
        ([selectorValue, entities]: [IAdminRoleEntity, IAdminRoleEntity[]]): void => {
          this._store
            .pipe(
              select(
                groupsSelectors.getGroupsByChainId(selectorValue.chainId)
              )
            )
            .pipe(take(1))
            .subscribe((groups): void => {
              this.groupOptions = [];

              groups.forEach((group: IGroup): void => {
                if (
                  !entities.map((e): string => e.groupId).includes(group._id)
                ) {
                  this.groupOptions.push({
                    key: group._id,
                    value: group.name,
                  });
                }
              });
            });

          this._store
            .pipe(
              select(unitsSelectors.getUnitsByGroupId(selectorValue.groupId))
            )
            .pipe(take(1))
            .subscribe((units): void => {
              this.unitOptions = [];

              units.forEach((unit: IUnit): void => {
                if (!entities.map((e): string => e.unitId).includes(unit._id)) {
                  this.unitOptions.push({
                    key: unit._id,
                    value: unit.name,
                  });
                }
              });
            });
        }
      );
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public addUnit(): void {
    const arr = [...this.control.value.entities];
    arr.push({
      chainId: this.entitySelector.value.chainId,
      groupId: this.entitySelector.value.groupId,
      unitId: this.entitySelector.value.unitId,
    });
    this.control['controls'].entities.setValue(arr);

    this.entitySelector.patchValue({
      chainId: '',
      groupId: '',
      unitId: '',
    });
  }

  public removeUnit(idx: number): void {
    const arr = [...this.control.value.entities];
    arr.splice(idx, 1);

    this.control['controls'].entities.setValue(arr);
  }
}
