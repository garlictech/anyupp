import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as CrudApi from '@bgap/crud-gql/api';
import { KeyValue } from '@bgap/shared/types';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-unit-service-fee',
  styleUrls: ['./form-unit-service-fee.component.scss'],
  templateUrl: './form-unit-service-fee.component.html',
})
export class FormUnitServiceFeeComponent implements OnInit {
  @Input() serviceFeeFormGroup?: FormGroup;
  public serviceFeeTypeControl: FormControl = new FormControl('');
  public EServiceFeeType = CrudApi.ServiceFeeType;

  public serviceFeeOptions: KeyValue[] = [
    CrudApi.ServiceFeeType.included,
    CrudApi.ServiceFeeType.applicable,
  ].map(
    (feeType): KeyValue => ({
      key: feeType,
      value: `units.serviceFee.type.${feeType}`,
    }),
  );

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.serviceFeeFormGroup?.get('type')?.value) {
      this.serviceFeeTypeControl.patchValue(
        this.serviceFeeFormGroup?.get('type')?.value,
      );

      this.serviceFeeFormGroup?.enable();
    }

    this.serviceFeeTypeControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(newTypeValue => {
        if (newTypeValue) {
          this.serviceFeeFormGroup?.enable();
          this.serviceFeeFormGroup?.get('type')?.patchValue(newTypeValue);
        } else {
          this.serviceFeeFormGroup?.get('percentage')?.patchValue('');
          this.serviceFeeFormGroup?.disable();
        }

        this._changeDetectorRef.markForCheck();
      });
  }
}
