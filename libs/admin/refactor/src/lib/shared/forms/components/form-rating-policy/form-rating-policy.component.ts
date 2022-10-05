import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { RATING_DEFINITIONS } from '../../../../shared/utils';

import { KeyValue } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { FormsService } from '../../services/forms/forms.service';
import { RatingPolicy } from '@bgap/domain';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-rating-policy',
  styleUrls: ['./form-rating-policy.component.scss'],
  templateUrl: './form-rating-policy.component.html',
})
export class FormRatingPolicyComponent implements OnInit {
  @Input() ratingPoliciesFormArray?: FormArray;
  public ratingPolicyControl: FormControl = new FormControl(
    '',
    Validators.required,
  );
  public ratingPolicyOptions$?: Observable<KeyValue[]>;
  private _ratingDefinitionList = RATING_DEFINITIONS.map(
    cat => cat.questions,
  ).reduce((prev, current) => [...prev, ...current]);

  constructor(
    private _formsService: FormsService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.ratingPolicyOptions$ = this.ratingPoliciesFormArray?.valueChanges.pipe(
      startWith(this.ratingPoliciesFormArray.value || []),
      untilDestroyed(this),
      map((arrayValues: RatingPolicy[]): KeyValue[] =>
        this._ratingDefinitionList
          .filter(p => !arrayValues.map(v => v.key).includes(p.key))
          .map(rating => ({
            key: rating.key,
            value: rating.title,
          })),
      ),
    );
  }

  public addRatingPolicyToList() {
    const policy = this._ratingDefinitionList.find(
      r => r.key === this.ratingPolicyControl.value,
    );

    if (policy) {
      const policyGroup = this._formsService.createRatingPolicyFormGroup();
      policyGroup.patchValue(policy);
      this.ratingPoliciesFormArray?.push(policyGroup);

      this.ratingPolicyControl.patchValue('');
    }
  }

  public removePolicyFromList(idx: number) {
    (<FormArray>this.ratingPoliciesFormArray)?.removeAt(idx);
    this._changeDetectorRef.detectChanges();
  }
}
