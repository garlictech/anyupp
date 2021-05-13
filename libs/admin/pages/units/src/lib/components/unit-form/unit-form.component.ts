import * as fp from 'lodash/fp';
import { NGXLogger } from 'ngx-logger';
import { delay, take } from 'rxjs/operators';

/* eslint-disable @typescript-eslint/dot-notation */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import {
  AbstractFormDialogComponent,
  FormsService,
} from '@bgap/admin/shared/forms';
import {
  addressFormGroup,
  contactFormGroup,
  EToasterType,
  multiLangValidator,
  PAYMENT_MODES,
  TIME_FORMAT_PATTERN,
  unitOpeningHoursValidator,
} from '@bgap/admin/shared/utils';
import {
  ICustomDailySchedule,
  IGroup,
  IKeyValue,
  ILane,
  PaymentMode,
  IUnit,
} from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-unit-form',
  templateUrl: './unit-form.component.html',
})
export class UnitFormComponent
  extends AbstractFormDialogComponent
  implements OnInit, OnDestroy {
  public unit!: IUnit;
  public paymentModes = PAYMENT_MODES;
  public groupOptions: IKeyValue[] = [];

  private _groups: IGroup[] = [];

  constructor(
    protected _injector: Injector,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _formsService: FormsService,
    private _amplifyDataService: AmplifyDataService,
    private _logger: NGXLogger,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    super(_injector);

    this.dialogForm = this._formBuilder.group({
      groupId: ['', [Validators.required]],
      chainId: ['', [Validators.required]],
      isActive: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: this._formBuilder.group(
        {
          hu: [''],
          en: [''],
          de: [''],
        },
        { validators: multiLangValidator },
      ),
      paymentModes: [[]],
      ...contactFormGroup(),
      ...addressFormGroup(this._formBuilder, true),
      open: this._formBuilder.group({
        from: [''],
        to: [''],
      }),
      openingHours: this._formBuilder.group(
        {
          mon: this._formBuilder.group({
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          }),
          tue: this._formBuilder.group({
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          }),
          wed: this._formBuilder.group({
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          }),
          thu: this._formBuilder.group({
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          }),
          fri: this._formBuilder.group({
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          }),
          sat: this._formBuilder.group({
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          }),
          sun: this._formBuilder.group({
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          }),
          custom: this._formBuilder.array([]),
        },
        { validators: unitOpeningHoursValidator },
      ),
      lanes: this._formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    if (this.unit) {
      this.dialogForm.patchValue(cleanObject(fp.omit(['lanes'], this.unit)));

      // Parse openingHours object to temp array
      const custom: ICustomDailySchedule[] | undefined = this.unit?.openingHours
        ?.custom;

      if (custom) {
        custom.forEach((day: ICustomDailySchedule): void => {
          const dayGroup = this._formsService.createCustomDailyScheduleFormGroup();
          dayGroup.patchValue(day);

          (<FormArray>this.dialogForm?.get('openingHours')?.get('custom')).push(
            dayGroup,
          );
        });
      }

      // Patch lanes array
      (this.unit.lanes || []).forEach((lane: ILane): void => {
        const laneGroup = this._formsService.createLaneFormGroup();
        laneGroup.patchValue(lane);
        (<FormArray>this.dialogForm?.get('lanes')).push(laneGroup);
      });
    } else {
      // Patch ChainId
      this._store
        .pipe(
          select(loggedUserSelectors.getSelectedChainId),
          take(1),
          delay(200),
        )
        .subscribe((selectedChainId: string | undefined | null): void => {
          if (selectedChainId) {
            this.dialogForm.patchValue({ chainId: selectedChainId });

            this._changeDetectorRef.detectChanges();
          }
        });

      // Patch GroupId
      this._store
        .pipe(select(loggedUserSelectors.getSelectedGroupId), take(1))
        .subscribe((selectedGroupId: string | undefined | null): void => {
          if (selectedGroupId) {
            this.dialogForm.patchValue({ groupId: selectedGroupId });
          }
        });

      this.dialogForm.patchValue({ isActive: false });
    }

    this._store
      .pipe(
        select(groupsSelectors.getSelectedChainGroups),
        untilDestroyed(this),
      )
      .subscribe((groups: IGroup[]): void => {
        this._groups = groups;

        this.groupOptions = this._groups.map(
          (group: IGroup): IKeyValue => ({
            key: group.id,
            value: group.name,
          }),
        );

        this._changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public async submit(): Promise<void> {
    if (this.dialogForm?.valid) {
      if (this.unit?.id) {
        try {
          await this._amplifyDataService.update<IUnit>(
            'getUnit',
            'updateUnit',
            this.unit.id,
            () => this.dialogForm?.value,
          );

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.updateSuccessful',
          );
          this.close();
        } catch (error) {
          this._logger.error(`UNIT UPDATE ERROR: ${JSON.stringify(error)}`);
        }
      } else {
        try {
          await this._amplifyDataService.create('createUnit', {
            ...this.dialogForm?.value,
            isAcceptingOrders: false,
          });

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.insertSuccessful',
          );
          this.close();
        } catch (error) {
          this._logger.error(`UNIT INSERT ERROR: ${JSON.stringify(error)}`);
        }
      }
    }
  }

  public paymentModeIsChecked(paymentMode: PaymentMode): boolean {
    return (
      (this.dialogForm?.value.paymentModes || [])
        .map((m: PaymentMode): string => m.name)
        .indexOf(paymentMode.name) >= 0
    );
  }

  public togglePaymentMode(paymentMode: PaymentMode): void {
    const paymentModesArr: PaymentMode[] = this.dialogForm?.value.paymentModes;
    const idx = paymentModesArr
      .map((m): string => m.name)
      .indexOf(paymentMode.name);

    if (idx < 0) {
      paymentModesArr.push(fp.pick(['name', 'method'], paymentMode));
    } else {
      paymentModesArr.splice(idx, 1);
    }
    this.dialogForm?.controls.paymentModes.setValue(paymentModesArr);
  }
}
