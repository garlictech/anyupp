import { Pipe, PipeTransform } from '@angular/core';
import { zeroFill } from '@bgap/shared/utils';

@Pipe({
  name: 'secToHms',
})
export class SecToHmsPipe implements PipeTransform {
  transform(value: number): string {
    let totalSeconds = value;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${hours > 0 ? zeroFill(hours) + ':' : ''}${zeroFill(
      minutes,
    )}:${zeroFill(seconds)}`;
  }
}
