import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TipPolicy } from '@bgap/domain';
import { KeyValue } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { FormsService } from '../../services/forms/forms.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-tip-policy',
  styleUrls: ['./form-tip-policy.component.scss'],
  templateUrl: './form-tip-policy.component.html',
})
export class FormTipPolicyComponent implements OnInit {
  @Input() tipPolicyFormGroup?: UntypedFormGroup;

  public newPercentControl: UntypedFormControl = new UntypedFormControl(
    '',
    Validators.required,
  );
  public ratingPolicyOptions$?: Observable<KeyValue[]>;
  public percentList = '';

  constructor(private _formsService: FormsService) {}

  ngOnInit() {
    this.tipPolicyFormGroup?.valueChanges
      .pipe(startWith(this.tipPolicyFormGroup.value), untilDestroyed(this))
      .subscribe((tipPolicy: TipPolicy) => {
        this.percentList = tipPolicy.percents.join('; ');
      });
  }

  public addPercent() {
    this.tipPolicyFormGroup
      ?.get('percents')
      ?.patchValue(
        this._formsService.addUnitTipPercent(
          this.newPercentControl.value,
          this.tipPolicyFormGroup?.value?.percents || [],
        ),
      );
    this.newPercentControl.patchValue('');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onPercentRemove($event: { text: string }) {
    this.tipPolicyFormGroup
      ?.get('percents')
      ?.patchValue(
        this._formsService.removeUnitTipPercent(
          $event.text,
          this.tipPolicyFormGroup?.get('percents')?.value || [],
        ),
      );
  }
}
