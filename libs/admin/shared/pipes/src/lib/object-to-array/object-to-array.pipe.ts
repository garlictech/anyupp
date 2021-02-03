import { Pipe, PipeTransform } from '@angular/core';
import { objectToArray } from '@bgap/admin/shared/utils';
import { IKeyValueObject } from '@bgap/shared/types';

@Pipe({
  name: 'objectToArray',
})
export class ObjectToArrayPipe implements PipeTransform {
  transform(value: IKeyValueObject) {
    return objectToArray(value);
  }
}
