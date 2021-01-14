import { Pipe, PipeTransform } from '@angular/core';

import { objectToArray } from '../../pure';

@Pipe({
  name: 'objectToArray',
})
export class ObjectToArrayPipe implements PipeTransform {
  transform(value: unknown): unknown[] {
    return objectToArray(value);
  }
}
