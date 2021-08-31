import { isNumber, omit } from 'lodash/fp';

import {
  AbstractControl,
  FormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  EVariantAvailabilityType,
  ICustomDailySchedule,
  IDateIntervals,
} from '@bgap/shared/types';

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

export const unitOpeningHoursValidator: ValidatorFn = (
  control: AbstractControl,
) => {
  let error = null;

  Object.keys(control.value).forEach((d: string): void => {
    if (d === 'custom') {
      control.value[d].forEach((day: ICustomDailySchedule): void => {
        if (day.date && day.from && day.to && day.from >= day.to) {
          error = { timeInterval: true };
        }
      });
    } else {
      const day = control.value[d];

      if (day.from && day.to && day.from >= day.to) {
        error = { timeInterval: true };
      }
    }
  });

  return error;
};

export const getDayIntervals = (dateValue: string | number): IDateIntervals => {
  const start = new Date(dateValue);
  start.setHours(0, 0, 0, 0);

  const end = new Date(dateValue);
  end.setHours(23, 59, 59, 999);

  return {
    from: start.getTime(),
    to: end.getTime(),
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
