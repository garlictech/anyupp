import {
  AbstractControl,
  FormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  EVariantAvailabilityType,
  ICustomDailySchedule,
  IDateIntervals,
} from '@bgap/shared/types';

import { WEEKLY_VARIANT_AVAILABILITY } from '../const';

export const contactFormGroup = (formBuilder: FormBuilder) => ({
  email: ['', [Validators.email]],
  phone: [''],
  address: formBuilder.group({
    address: [''],
    city: [''],
    country: [''],
    title: [''],
    postalCode: [''],
    location: formBuilder.group({
      lat: [''],
      lng: [''],
    }),
  }),
});

export const multiLangValidator: ValidatorFn = (control: AbstractControl) => {
  const hu = control.get('hu')?.value;
  const en = control.get('en')?.value;
  const de = control.get('de')?.value;

  return hu || en || de ? null : { empty: true };
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
    if (d === 'override') {
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
