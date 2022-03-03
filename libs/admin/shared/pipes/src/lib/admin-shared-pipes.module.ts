import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AsFormArrayPipe } from './as-form-array/as-form-array.pipe';
import { AsFormControlPipe } from './as-form-control/as-form-control.pipe';
import { AsFormGroupPipe } from './as-form-group/as-form-group.pipe';
import { AwsStoragePathPipe } from './aws-storage-path/aws-storage-path';
import { CurrencyFormatterPipe } from './currency-formatter/currency-formatter.pipe';
import { IterableAbstractControlsPipe } from './iterable-abstract-controls/iterable-abstract-controls.pipe';
import { LocalizePipe } from './localize/localize.pipe';
import { LocalizedDatePipe } from './localized-date/localized-date.pipe';
import { ObjectToArrayPipe } from './object-to-array/object-to-array.pipe';
import { PaymentModeTypePipe } from './payment-mode-type/payment-mode-type.pipe';
import { ProductComponentInfoPipe } from './product-component-info/product-component-info';
import { ProductComponentSetInfoPipe } from './product-component-set-info/product-component-set-info';
import { SecToHmsPipe } from './sec-to-hms/sec-to-hms.pipe';

const PIPES = [
  LocalizePipe,
  LocalizedDatePipe,
  ObjectToArrayPipe,
  CurrencyFormatterPipe,
  SecToHmsPipe,
  AsFormControlPipe,
  AsFormArrayPipe,
  AsFormGroupPipe,
  IterableAbstractControlsPipe,
  AwsStoragePathPipe,
  ProductComponentInfoPipe,
  ProductComponentSetInfoPipe,
  PaymentModeTypePipe,
];

@NgModule({
  declarations: [...PIPES],
  exports: [...PIPES],
  providers: [LocalizePipe, CurrencyFormatterPipe, AwsStoragePathPipe],
  imports: [CommonModule],
})
export class AdminSharedPipesModule {}
