import { isNumber, omit } from 'lodash/fp';
import { DateTime } from 'luxon';

import {
  AbstractControl,
  FormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import * as CrudApi from '@bgap/crud-gql/api';
import { EVariantAvailabilityType, DateIntervals } from '@bgap/shared/types';

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
      location: formBuilder.group({
        lat: [0],
        lng: [0],
      }),
    },
    required ? {} : { validators: emptyAddressValidator },
  ),
});

export const multiLangValidator: ValidatorFn = (control: AbstractControl) => {
  const hu = control.get('hu')?.value;
  const en = control.get('en')?.value;
  const de = control.get('de')?.value;

  return hu || en || de ? null : { empty: true };
};

export const addressIsEmpty = (address: CrudApi.Address) => {
  const stringFields = omit(['location'], address);
  const allStringsAreEmpty = Object.values(stringFields).every(v => !v);

  // 0 or empty string
  const locationIsEmpty = !address.location?.lat && !address.location?.lng;

  return allStringsAreEmpty && locationIsEmpty;
};

export const addressIsFilled = (address: CrudApi.Address) => {
  const stringFields = omit(['location'], address);
  const allStringsAreFilled = Object.values(stringFields).every(v => v);

  // not 0 numeric
  const locationIsFilled =
    isNumber(address.location?.lat) &&
    isNumber(address.location?.lng) &&
    (address.location?.lat !== 0 || address.location?.lng !== 0);

  return allStringsAreFilled && locationIsFilled;
};

// Address: all fields are empty, or all fields are required.
export const emptyAddressValidator: ValidatorFn = (
  control: AbstractControl,
) => {
  const isEmpty = addressIsEmpty(control.value);
  const isFilled = addressIsFilled(control.value);

  return isEmpty || isFilled ? null : { err: true };
};

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

export const getDayIntervals = (
  dateValue: string | number,
  timeZone: string,
): DateIntervals => {
  const date: DateTime = DateTime.fromISO(new Date(dateValue).toISOString(), {
    zone: timeZone,
  });

  return {
    from: date.startOf('day').valueOf(),
    to: date.endOf('day').valueOf(),
  };
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
