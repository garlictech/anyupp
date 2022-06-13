import { Pipe, PipeTransform } from '@angular/core';
import { PaymentType } from '@bgap/domain';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'paymentModeType',
})
export class PaymentModeTypePipe implements PipeTransform {
  constructor(private _translateService: TranslateService) {}

  transform(paymentModeType: PaymentType): string {
    return this._translateService.instant(
      `common.paymentModes.${paymentModeType}`,
    );
  }
}
