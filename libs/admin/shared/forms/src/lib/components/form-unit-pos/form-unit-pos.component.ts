import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as CrudApi from '@bgap/crud-gql/api';
import { KeyValue } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-unit-pos',
  styleUrls: ['./form-unit-pos.component.scss'],
  templateUrl: './form-unit-pos.component.html',
})
export class FormUnitPosComponent implements OnInit {
  @Input() posFormGroup?: FormGroup;
  @Input() externalIdControl?: FormControl;
  @Input() editing = false;
  @Output() changePasswordEmitter = new EventEmitter();

  public ePosType = CrudApi.PosType;
  public posTypeOptions: KeyValue[] = [
    {
      key: CrudApi.PosType.anyupp,
      value: 'AnyUPP',
    },
    {
      key: CrudApi.PosType.rkeeper,
      value: 'RKeepeR',
    },
  ];

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (!this.editing) {
      this.posFormGroup?.controls['type'].valueChanges
        .pipe(untilDestroyed(this))
        .subscribe(newTypeValue => {
          if (newTypeValue === CrudApi.PosType.rkeeper) {
            this.posFormGroup?.controls['rkeeper'].enable();

            if (!this.posFormGroup?.value.rkeeper?.anyuppPassword) {
              this.generateNewPassword();

              (<FormGroup>this.posFormGroup?.controls['rkeeper']).controls[
                'anyuppUsername'
              ].patchValue('user');
            }
          } else {
            this.posFormGroup?.controls['rkeeper'].disable();
            this.externalIdControl?.patchValue(null);
          }

          // detectChanges not refresh the UI correctly!
          this._changeDetectorRef.markForCheck();
        });
    }
  }

  public generateNewPassword() {
    this.changePasswordEmitter.emit();
  }
}
