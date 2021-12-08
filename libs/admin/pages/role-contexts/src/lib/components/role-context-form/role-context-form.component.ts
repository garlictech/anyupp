import { pairwise, startWith, take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { catchGqlError } from '@bgap/admin/shared/data-access/app-core';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { multiLangValidator } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { KeyValue } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

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
  public chainOptions: KeyValue[] = [];
  public groupOptions: KeyValue[] = [];
  public unitOptions: KeyValue[] = [];
  public eAdminRole = CrudApi.Role;
  public chainDisabled = true;
  public groupDisabled = true;
  public unitDisabled = true;

  constructor(
    protected _injector: Injector,
    private _translateService: TranslateService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _crudSdk: CrudSdkService,
  ) {
    super(_injector);

    this.roleOptions = Object.keys(CrudApi.Role).map(
      (key): KeyValue => ({
        key: CrudApi.Role[<keyof typeof CrudApi.Role>key].toString(),
        value: this._translateService.instant(
          `roles.${CrudApi.Role[<keyof typeof CrudApi.Role>key]}`,
        ),
      }),
    );
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group(
      {
        name: this._formBuilder.group(
          {
            hu: [''],
            en: [''],
            de: [''],
          },
          { validators: multiLangValidator },
        ),
        role: [CrudApi.Role.inactive, [Validators.required]],
        chainId: [''],
        groupId: [''],
        unitId: [''],
      },
      { validators: this._roleLevelValidator },
    );

    if (this.roleContext) {
      this.dialogForm.patchValue(cleanObject(this.roleContext));

      this._refreshGroupOptionsByChainId(this.roleContext.chainId || '');
      this._refreshUnitOptionsByGroupId(this.roleContext.groupId || '');

      this._refreshDisabledFields(this.roleContext?.role);
    }

    this._store
      .pipe(select(chainsSelectors.getAllChains), untilDestroyed(this))
      .subscribe((chains: CrudApi.Chain[]) => {
        this.chainOptions = chains.map(chain => ({
          key: chain.id,
          value: chain.name,
        }));

        this._changeDetectorRef.detectChanges();
      });

    this.dialogForm.valueChanges
      .pipe(startWith(this.dialogForm.value), pairwise(), untilDestroyed(this))
      .subscribe(([prev, next]: [CrudApi.RoleContext, CrudApi.RoleContext]) => {
        this._refreshDisabledFields(next.role);

        if (prev.role !== next.role) {
          this.dialogForm.patchValue({
            chainId: undefined,
            groupId: undefined,
            unitId: undefined,
          });
        }

        if (prev.chainId !== next.chainId) {
          this.dialogForm.patchValue({
            groupId: undefined,
            unitId: undefined,
          });

          this._refreshGroupOptionsByChainId(next.chainId || '');
        }

        if (prev.groupId !== next.groupId) {
          this.dialogForm.patchValue({
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

  private _roleLevelValidator = (control: AbstractControl): unknown => {
    switch (control.value.role) {
      case CrudApi.Role.inactive:
      case CrudApi.Role.superuser:
        return null;
      case CrudApi.Role.chainadmin:
        return control.value.chainId ? null : { empty: true };
      case CrudApi.Role.groupadmin:
        return control.value.chainId && control.value.groupId
          ? null
          : { empty: true };
      case CrudApi.Role.unitadmin:
      case CrudApi.Role.staff:
        return control.value.chainId &&
          control.value.groupId &&
          control.value.unitId
          ? null
          : { empty: true };
      default:
        return null;
    }
  };

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
      if (this.roleContext?.id) {
        this._crudSdk.sdk
          .UpdateRoleContext({
            input: {
              id: this.roleContext.id,
              ...this.dialogForm.value,
            },
          })
          .pipe(catchGqlError(this._store))
          .subscribe(() => {
            this._toasterService.showSimpleSuccess('common.updateSuccessful');

            this.close();
          });
      } else {
        this._crudSdk.sdk
          .CreateRoleContext({
            input: {
              ...this.dialogForm?.value,
              contextId: Math.random().toString(36).substring(2, 8),
            },
          })
          .pipe(catchGqlError(this._store))
          .subscribe(() => {
            this._toasterService.showSimpleSuccess('common.insertSuccessful');
            this.close();
          });
      }
    }
  }
}
