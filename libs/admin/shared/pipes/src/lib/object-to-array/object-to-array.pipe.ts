import { Pipe, PipeTransform } from '@angular/core';
import { objectToArray } from '@bgap/admin/shared/utils';
import { IKeyValue, IKeyValueObject } from 'libs/shared/types/src';

@Pipe({
  name: 'objectToArray',
})
export class ObjectToArrayPipe implements PipeTransform {
  transform(value: IKeyValueObject) {
    return objectToArray(value);
  }
}
