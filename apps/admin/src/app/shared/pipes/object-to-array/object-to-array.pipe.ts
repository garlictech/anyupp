import { Pipe, PipeTransform } from '@angular/core';

import { objectToArray } from '../../pure';

@Pipe({
  name: 'objectToArray',
})
export class ObjectToArrayPipe implements PipeTransform {
  transform(value: unknown): any[] {
    return objectToArray(value);
  }
}
