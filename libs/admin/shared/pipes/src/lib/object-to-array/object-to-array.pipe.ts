import { Pipe, PipeTransform } from '@angular/core';
import { objectToArray } from '@bgap/shared/utils';
import { IKeyValueObject } from '@bgap/shared/types';

@Pipe({
  name: 'objectToArray',
})
export class ObjectToArrayPipe implements PipeTransform {
  transform(value: IKeyValueObject, idKey?: string) {
    return objectToArray(value, idKey);
  }
}
