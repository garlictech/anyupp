import { isNumber, omit } from 'lodash/fp';

import {
  AbstractControl,
  FormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import * as CrudApi from '@bgap/crud-gql/api';
import { EVariantAvailabilityType } from '@bgap/shared/types';

import { WEEKLY_VARIANT_AVAILABILITY } from '../const';

export const contactFormGroup = (requiredEmail = false) => ({
  email: requiredEmail
    ? ['', [Validators.email, Validators.required]]
    : ['', [Validators.email]],
  phone: [''],
});

export const addressFormGroup = (
  formBuilder: FormBuilder,
  required = false,
) => ({
  address: formBuilder.group(
    {
      address: ['', required ? [Validators.required] : []],
      city: ['', required ? [Validators.required] : []],
      country: ['', required ? [Validators.required] : []],
      title: [''],
      postalCode: ['', required ? [Validators.required] : []],
    },
    required ? {} : { validators: emptyAddressValidator },
  ),
});

export const locationFormGroup = (
  formBuilder: FormBuilder,
  required = false,
) => ({
  location: formBuilder.group(
    {
      lat: [0],
      lon: [0],
    },
    required ? {} : { validators: emptyLocationValidator },
  ),
});

export const multiLangValidator: ValidatorFn = (control: AbstractControl) => {
  const hu = control.get('hu')?.value;
  const en = control.get('en')?.value;
  const de = control.get('de')?.value;

  return hu || en || de ? null : { empty: true };
};

export const addressIsEmpty = (address?: CrudApi.Address) => {
  const stringFields = omit(['location'], address);
  const allStringsAreEmpty = Object.values(stringFields).every(v => !v);

  return allStringsAreEmpty;
};

export const addressIsFilled = (address: CrudApi.Address) => {
  const stringFields = omit(['location'], address);
  const allStringsAreFilled = Object.values(stringFields).every(v => v);

  return allStringsAreFilled;
};

export const locationIsFilled = (location: CrudApi.LocationLatLon) =>
  isNumber(location?.lat) &&
  isNumber(location?.lon) &&
  (location?.lat !== 0 || location?.lon !== 0);

// Address: all fields are empty, or all fields are required.
export const emptyAddressValidator: ValidatorFn = (
  control: AbstractControl,
) => {
  const isEmpty = addressIsEmpty(control.value);
  const isFilled = addressIsFilled(control.value);

  return isEmpty || isFilled ? null : { err: true };
};

// Address: all fields are empty, or all fields are required.
export const emptyLocationValidator: ValidatorFn = (control: AbstractControl) =>
  locationIsFilled(control.value) ? null : { err: true };

export const productAvailabilityValidator: ValidatorFn = (
  control: AbstractControl,
) => {
  const type = control.get('type')?.value;
  const dayFrom = control.get('dayFrom')?.value;
  const dayTo = control.get('dayTo')?.value;
  const timeFrom = control.get('timeFrom')?.value;
  const timeTo = control.get('timeTo')?.value;

  if (type === EVariantAvailabilityType.WEEKLY) {
    const days = Object.keys(WEEKLY_VARIANT_AVAILABILITY);

    const dayError =
      dayFrom && dayTo
        ? days.indexOf(dayFrom) <= days.indexOf(dayTo)
          ? null
          : { dayInterval: true }
        : { missingDay: true };

    const timeError =
      timeFrom && timeTo
        ? timeFrom < timeTo
          ? null
          : { timeInterval: true }
        : { missingTime: true };

    return dayError || timeError || null;
  } else if (type === EVariantAvailabilityType.SEASONAL) {
    const dayError =
      dayFrom && dayTo
        ? dayFrom <= dayTo
          ? null
          : { dayInterval: true }
        : { missingDay: true };
    const timeError =
      timeFrom && timeTo
        ? timeFrom < timeTo
          ? null
          : { timeInterval: true }
        : { missingTime: true };

    return dayError || timeError || null;
  }

  return null;
};

export const dailyScheduleBothEmptyOrProperlyFilledValidator: ValidatorFn = (
  control: AbstractControl,
) => {
  const from = control.get('from')?.value;
  const to = control.get('to')?.value;

  return (!!from && !!to) || (!from && !to)
    ? control.get('from')?.valid && control.get('to')?.valid
      ? null
      : { timeFormat: true }
    : { missingIntervall: true };
};

export const makeId = (length: number): string => {
  let result = '';
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsLength = chars.length;

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }

  return result;
};

export const optionalValueValidator: ValidatorFn = (control: AbstractControl) =>
  !control.value || !!control.value ? null : { err: true };

export const notEmptyArray: ValidatorFn = (control: AbstractControl) =>
  control.value.length > 0 ? null : { err: true };

export const getInitials = (text: string) => {
  const parts = (text || '').split(' ').filter(i => !!i);

  return (
    (parts[0] || '-').charAt(0) + (parts[1] ? parts[1].charAt(0) : '')
  ).toUpperCase();
};
