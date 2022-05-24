import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormatter',
})
export class CurrencyFormatterPipe implements PipeTransform {
  transform(value: number | string | undefined, currency: string): string {
    const safeValue = typeof value === 'string' ? parseFloat(value) : value;

    switch (currency) {
      case 'EUR':
      case '€':
        return `€${safeValue?.toFixed(2)}`;
      case 'HUF':
        return `${safeValue?.toFixed(0)} Ft`;
      case 'USD':
        return `$${safeValue?.toFixed(2)}`;
      default:
        return '';
    }
  }
}
