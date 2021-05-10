import { NGXLogger } from 'ngx-logger';
import { pairwise, startWith, take } from 'rxjs/operators';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { EToasterType, multiLangValidator } from '@bgap/admin/shared/utils';
import { EAdminRole, IChain, IKeyValue, IRoleContext } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
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
  implements OnInit {
  public roleContext!: IRoleContext;
  public roleOptions: IKeyValue[];
  public chainOptions: IKeyValue[] = [];
  public groupOptions: IKeyValue[] = [];
  public unitOptions: IKeyValue[] = [];
  public eAdminRole = EAdminRole;
  public chainDisabled = true;
  public groupDisabled = true;
  public unitDisabled = true;

  constructor(
    protected _injector: Injector,
    private _store: Store<any>,
    private _amplifyDataService: AmplifyDataService,
    private _logger: NGXLogger,
    private _translateService: TranslateService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    super(_injector);

    this.roleOptions = Object.keys(EAdminRole).map(
      (key): IKeyValue => ({
        key: EAdminRole[<keyof typeof EAdminRole>key].toString(),
        value: this._translateService.instant(
          `roles.${EAdminRole[<keyof typeof EAdminRole>key]}`,
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
        role: [EAdminRole.INACTIVE, [Validators.required]],
        chainId: [''],
        groupId: [''],
        unitId: [''],
      },
      { validators: this._roleLevelValidator },
    );

    if (this.roleContext) {
      this.dialogForm.patchValue(
        cleanObject(this.roleContext),
      );

      this._refreshGroupOptionsByChainId(this.roleContext.chainId || '');
      this._refreshUnitOptionsByGroupId(this.roleContext.groupId || '');

      this._refreshDisabledFields(this.roleContext.role);
    }

    this._store
      .pipe(select(chainsSelectors.getAllChains), untilDestroyed(this))
      .subscribe((chains: IChain[]) => {
        this.chainOptions = chains.map(chain => ({
          key: chain.id,
          value: chain.name,
        }));

        this._changeDetectorRef.detectChanges();
      });

    this.dialogForm.valueChanges
      .pipe(startWith(this.dialogForm.value), pairwise(), untilDestroyed(this))
      .subscribe(([prev, next]: [IRoleContext, IRoleContext]) => {
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

          this._refreshGroupOptionsByChainId(next.chainId);
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
      case EAdminRole.INACTIVE:
      case EAdminRole.SUPERUSER:
        return null;
      case EAdminRole.CHAIN_ADMIN:
        return control.value.chainId ? null : { empty: true };
      case EAdminRole.GROUP_ADMIN:
        return control.value.chainId && control.value.groupId
          ? null
          : { empty: true };
      case EAdminRole.UNIT_ADMIN:
      case EAdminRole.STAFF:
        return control.value.chainId &&
          control.value.groupId &&
          control.value.unitId
          ? null
          : { empty: true };
      default:
        return null;
    }
  };

  private _refreshDisabledFields(role: EAdminRole) {
    this.chainDisabled = [
      EAdminRole.SUPERUSER,
      EAdminRole.INACTIVE,
      /* + new roles */
    ].includes(role);
    this.groupDisabled =
      this.chainDisabled ||
      [EAdminRole.CHAIN_ADMIN /* + new roles */].includes(role);
    this.unitDisabled =
      this.groupDisabled ||
      [EAdminRole.GROUP_ADMIN /* + new roles */].includes(role);

    this._changeDetectorRef.detectChanges();
  }

  public async submit(): Promise<void> {
    if (this.dialogForm?.valid) {
      if (this.roleContext?.id) {
        try {
          await this._amplifyDataService.update<IRoleContext>(
            'getRoleContext',
            'updateRoleContext',
            this.roleContext.id,
            () => this.dialogForm.value,
          );

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.updateSuccessful',
          );

          this.close();
        } catch (error) {
          this._logger.error(
            `ROLE CONTEXT UPDATE ERROR: ${JSON.stringify(error)}`,
          );
        }
      } else {
        try {
          await this._amplifyDataService.create('createRoleContext', {
            ...this.dialogForm?.value,
            contextId: Math.random().toString(36).substring(2, 8),
          });

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.insertSuccessful',
          );

          this.close();
        } catch (error) {
          this._logger.error(
            `ROLE CONTEXT INSERT ERROR: ${JSON.stringify(error)}`,
          );
        }
      }
    }
  }
}
