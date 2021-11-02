import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  addressFormGroup,
  contactFormGroup,
  multiLangValidator,
} from '@bgap/admin/shared/utils';

@Injectable({ providedIn: 'root' })
export class ChainFormService {
  constructor(private _formBuilder: FormBuilder) {}

  public createChainFormGroup() {
    return this._formBuilder.group({
      name: ['', [Validators.required]],
      description: this._formBuilder.group(
        {
          hu: [''],
          en: [''],
          de: [''],
        },
        { validators: multiLangValidator },
      ),
      isActive: ['', [Validators.required]],
      ...contactFormGroup(),
      ...addressFormGroup(this._formBuilder),
      style: this._formBuilder.group({
        colors: this._formBuilder.group({
          backgroundLight: ['#ffffff', [Validators.required]],
          backgroundDark: ['#ffffff', [Validators.required]],
          textDark: ['#ffffff', [Validators.required]],
          textLight: ['#ffffff', [Validators.required]],
          borderDark: ['#ffffff', [Validators.required]],
          borderLight: ['#ffffff', [Validators.required]],
          indicator: ['#ffffff', [Validators.required]],
          highlight: ['#ffffff', [Validators.required]],
          disabled: ['#ffffff', [Validators.required]],
          primary: ['#ffffff', [Validators.required]],
          secondary: ['#ffffff', [Validators.required]],
        }),
        images: this._formBuilder.group({
          logo: [''],
          header: [''],
        }),
      }),
    });
  }
}
