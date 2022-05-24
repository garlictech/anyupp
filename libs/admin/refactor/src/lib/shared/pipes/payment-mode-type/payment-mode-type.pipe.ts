import { Pipe, PipeTransform } from '@angular/core';
import * as CrudApi from '@bgap/crud-gql/api';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'paymentModeType',
})
export class PaymentModeTypePipe implements PipeTransform {
  constructor(private _translateService: TranslateService) {}

  transform(paymentModeType: CrudApi.PaymentType): string {
    return this._translateService.instant(
      `common.paymentModes.${paymentModeType}`,
    );
  }
}
