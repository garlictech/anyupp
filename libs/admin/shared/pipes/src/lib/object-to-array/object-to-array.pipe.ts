import { Pipe, PipeTransform } from '@angular/core';
import { objectToArray } from '@bgap/admin/shared/utils';

@Pipe({
  name: 'objectToArray',
})
export class ObjectToArrayPipe implements PipeTransform {
  transform(value: unknown): unknown[] {
    return objectToArray(value);
  }
}
