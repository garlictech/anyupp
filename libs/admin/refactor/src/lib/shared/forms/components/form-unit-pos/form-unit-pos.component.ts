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
import { PosType } from '@bgap/domain';
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
  @Input() rkeeperEdit = false;
  @Output() changePasswordEmitter = new EventEmitter();

  public ePosType = PosType;
  public posTypeOptions: KeyValue[] = [
    {
      key: PosType.anyupp,
      value: 'AnyUPP',
    },
    {
      key: PosType.rkeeper,
      value: 'RKeepeR',
    },
  ];

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.posFormGroup?.controls['type'].valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(newTypeValue => {
        if (newTypeValue === PosType.rkeeper) {
          this.posFormGroup?.controls['rkeeper'].enable();

          if (!this.posFormGroup?.value.rkeeper?.anyuppPassword) {
            this.generateNewPassword();

            (<FormGroup>this.posFormGroup?.controls['rkeeper']).controls[
              'anyuppUsername'
            ].patchValue('user');
          }
        } else {
          this.posFormGroup?.controls['rkeeper'].disable();
        }

        this._changeDetectorRef.markForCheck();
      });
  }

  public generateNewPassword() {
    this.changePasswordEmitter.emit();
  }
}
