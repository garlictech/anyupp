import { cloneDeep } from 'lodash/fp';
import { Observable } from 'rxjs';
import { pairwise, startWith, take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { chainsSelectors } from '@bgap/admin/store/chains';
import { groupsSelectors } from '@bgap/admin/store/groups';
import { unitsSelectors } from '@bgap/admin/store/units';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import * as CrudApi from '@bgap/crud-gql/api';
import { KeyValue, UpsertResponse } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select } from '@ngrx/store';

import { RoleContextsFormService } from '../services/role-contexts-form.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-role-context-form',
  templateUrl: './role-context-form.component.html',
  styleUrls: ['./role-context-form.component.scss'],
})
export class RoleContextFormComponent
  extends AbstractFormDialogComponent
  implements OnInit
{
  public roleContext?: CrudApi.RoleContext;
  public roleOptions: KeyValue[];
  public chainOptions$: Observable<KeyValue[]>;
  public groupOptions: KeyValue[] = [];
  public unitOptions: KeyValue[] = [];
  public eAdminRole = CrudApi.Role;
  public chainDisabled = true;
  public groupDisabled = true;
  public unitDisabled = true;

  constructor(
    protected _injector: Injector,
    private _changeDetectorRef: ChangeDetectorRef,
    private _roleContextsFormService: RoleContextsFormService,
  ) {
    super(_injector);

    this.roleOptions = this._roleContextsFormService.getRoleOptions();

    this.chainOptions$ = this._store.select(
      chainsSelectors.getAllChainOptions(),
    );
  }

  ngOnInit() {
    this.dialogForm =
      this._roleContextsFormService.createRoleContextFormGroup();

    if (this.roleContext) {
      this.dialogForm.patchValue(cleanObject(this.roleContext));

      this._refreshGroupOptionsByChainId(this.roleContext.chainId || '');
      this._refreshUnitOptionsByGroupId(this.roleContext.groupId || '');

      this._refreshDisabledFields(this.roleContext?.role);
    }

    this.dialogForm.valueChanges
      .pipe(startWith(this.dialogForm.value), pairwise(), untilDestroyed(this))
      .subscribe(([prev, next]: [CrudApi.RoleContext, CrudApi.RoleContext]) => {
        this._refreshDisabledFields(next.role);

        if (prev.role !== next.role) {
          this.dialogForm?.patchValue({
            chainId: undefined,
            groupId: undefined,
            unitId: undefined,
          });
        }

        if (prev.chainId !== next.chainId) {
          this.dialogForm?.patchValue({
            groupId: undefined,
            unitId: undefined,
          });

          this._refreshGroupOptionsByChainId(next.chainId || '');
        }

        if (prev.groupId !== next.groupId) {
          this.dialogForm?.patchValue({
            unitId: undefined,
          });

          this._refreshUnitOptionsByGroupId(next.groupId || '');
        }

        this._changeDetectorRef.detectChanges();
      });
  }

  private _refreshGroupOptionsByChainId(chainId: string) {
    this._store
      .pipe(select(groupsSelectors.getGroupsByChainId(chainId)), take(1))
      .subscribe((groups): void => {
        this.groupOptions = groups.map(group => ({
          key: group.id,
          value: group.name,
        }));

        this._changeDetectorRef.detectChanges();
      });
  }

  private _refreshUnitOptionsByGroupId(groupId: string) {
    this._store
      .pipe(select(unitsSelectors.getUnitsByGroupId(groupId || '')), take(1))
      .subscribe((units): void => {
        this.unitOptions = units.map(unit => ({
          key: unit.id,
          value: unit.name,
        }));

        this._changeDetectorRef.detectChanges();
      });
  }

  private _refreshDisabledFields(role: CrudApi.Role) {
    this.chainDisabled = [
      CrudApi.Role.superuser,
      CrudApi.Role.inactive,
      /* + new roles */
    ].includes(role);

    this.groupDisabled =
      this.chainDisabled ||
      [CrudApi.Role.chainadmin /* + new roles */].includes(role);

    this.unitDisabled =
      this.groupDisabled ||
      [CrudApi.Role.groupadmin /* + new roles */].includes(role);

    this._changeDetectorRef.detectChanges();
  }

  public submit() {
    if (this.dialogForm?.valid) {
      const contextId = Math.random().toString(36).substring(2, 8);
      this._roleContextsFormService
        .saveForm$(
          cloneDeep(this.dialogForm.value),
          contextId,
          this.roleContext?.id,
        )
        .subscribe((response: UpsertResponse<unknown>) => {
          this._toasterService.showSimpleSuccess(response.type);

          this.close();
        });
    }
  }
}
