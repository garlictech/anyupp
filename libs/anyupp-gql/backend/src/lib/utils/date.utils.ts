import { DateTime } from 'luxon';
import { IAvailability } from '@bgap/shared/types';

export const WEEK_DAYS: {
  MONDAY: number;
  TUESDAY: number;
  WEDNESDAY: number;
  THURSDAY: number;
  FRIDAY: number;
  SATURDAY: number;
  SUNDAY: number;
  [index: string]: number;
} = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
};

export const getSeasonalAvailabilityFromTime = (
  availability: IAvailability,
  inTimeZone: string,
) =>
  DateTime.fromISO(`${availability.dayFrom}T${availability.timeFrom}`, {
    zone: inTimeZone,
  });
export const getSeasonalAvailabilityToTime = (
  availability: IAvailability,
  inTimeZone: string,
) =>
  DateTime.fromISO(`${availability.dayTo}T${availability.timeTo}`, {
    zone: inTimeZone,
  });

// /**
//  * Returns an environment and test type specific version of the timestamp Class
//  * to be able to run the same code in prod and testing environments
//  *
//  * see:
//  *  https://code.luasoftware.com/tutorials/google-cloud-firestore/firestore-timestamp-invalid-data/
//  *  https://github.com/firebase/firebase-js-sdk/issues/1615
//  */
// export const timestampFactory = (fContext?: FunctionContext) => {
//     // CHECK this: Where will the console log show up?
//     // 1 - In the emulator's terminal => testType === internal
//     // 2 - In the test runner's terminal => testType === external
//     if (config.stage === "emulator" && fContext?.testType === ETestType.EXTERNAL) {
//         return firebase.firestore.Timestamp;
//     } else {
//         return fbAdmin.firestore.Timestamp;
//     }
// };
