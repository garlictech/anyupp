import { combineLatest } from 'rxjs';
import { startWith, take } from 'rxjs/operators';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import {
  IAdminRoleEntity,
  IAssignedEntityNames,
  IChain,
  IGroup,
  IKeyValue,
  IUnit,
} from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-form-staff-role',
  templateUrl: './form-staff-role.component.html',
})
export class FormStaffRoleComponent implements OnInit, OnDestroy {
  @Input() control!: FormGroup;
  public groupOptions: IKeyValue[];
  public chainOptions: IKeyValue[];
  public unitOptions: IKeyValue[];
  public entitySelector: FormGroup;
  public assignedUnits: IAssignedEntityNames[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private _store: Store<any>, private _formBuilder: FormBuilder) {
    this.groupOptions = [];
    this.chainOptions = [];
    this.unitOptions = [];
    this.assignedUnits = [];
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
      (<FormGroup>this.control.get('entities')).valueChanges.pipe(
        startWith(this.control.value.entities),
      ),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(
        ([chains, groups, units, entities]: [
          IChain[],
          IGroup[],
          IUnit[],
          IAdminRoleEntity[],
        ]): void => {
          this.chainOptions = chains.map(chain => ({
            key: chain.id,
            value: chain.name,
          }));
          this.assignedUnits = entities.map(entity => ({
            chainName: chains.find((c): boolean => c.id === entity.chainId)
              ?.name,
            groupName: groups.find((g): boolean => g.id === entity.groupId)
              ?.name,
            unitName: units.find((u): boolean => u.id === entity.unitId)?.name,
          }));
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

              this.groupOptions = groups
                .filter(
                  group =>
                    !entities
                      .map((e): string => e.groupId || '')
                      .includes(group.id),
                )
                .map(group => ({ key: group.id, value: group.name }));
            });

          this._store
            .pipe(
              select(
                unitsSelectors.getUnitsByGroupId(selectorValue.groupId || ''),
              ),
            )
            .pipe(take(1))
            .subscribe((units): void => {
              this.unitOptions = units
                .filter(
                  unit =>
                    !entities
                      .map((e): string => e.unitId || '')
                      .includes(unit.id),
                )
                .map(unit => ({ key: unit.id, value: unit.name }));
            });
        },
      );
  }

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
    (<FormGroup>this.control.get('entities')).setValue(arr);

    this.entitySelector.patchValue({
      chainId: '',
      groupId: '',
      unitId: '',
    });
  }

  public removeUnit(idx: number): void {
    const arr = [...this.control.value.entities];
    arr.splice(idx, 1);

    (<FormGroup>this.control.get('entities')).setValue(arr);
  }
}
