import { Pipe, PipeTransform } from '@angular/core';
import { objectToArray } from '@bgap/shared/utils';
import { KeyValueObject } from '@bgap/shared/types';

@Pipe({
  name: 'objectToArray',
})
export class ObjectToArrayPipe implements PipeTransform {
  transform(value: KeyValueObject, idKey?: string) {
    return objectToArray(value, idKey);
  }
}
