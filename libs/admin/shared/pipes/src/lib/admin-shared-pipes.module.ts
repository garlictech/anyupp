import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CurrencyFormatterPipe } from './currency-formatter/currency-formatter.pipe';
import { LocalizePipe } from './localize/localize.pipe';
import { LocalizedDatePipe } from './localized-date/localized-date.pipe';
import { ObjectToArrayPipe } from './object-to-array/object-to-array.pipe';
import { RoleEntityNamesPipe } from './role-entity-names/role-entity-names.pipe';
import { SecToHmsPipe } from './sec-to-hms/sec-to-hms.pipe';
import { AsFormControlPipe } from './as-form-control/as-form-control.pipe';
import { AsFormArrayPipe } from './as-form-array/as-form-array.pipe';
import { AsFormGroupPipe } from './as-form-group/as-form-group.pipe';
import { IterableAbstractControlsPipe } from './iterable-abstract-controls/iterable-abstract-controls.pipe';
import { AwsStoragePathPipe } from './aws-storage-path/aws-storage-path';

const PIPES = [
  LocalizePipe,
  LocalizedDatePipe,
  ObjectToArrayPipe,
  RoleEntityNamesPipe,
  CurrencyFormatterPipe,
  SecToHmsPipe,
  AsFormControlPipe,
  AsFormArrayPipe,
  AsFormGroupPipe,
  IterableAbstractControlsPipe,
  AwsStoragePathPipe,
];

@NgModule({
  declarations: [...PIPES],
  exports: [...PIPES],
  providers: [LocalizePipe, CurrencyFormatterPipe, AwsStoragePathPipe],
  imports: [CommonModule],
})
export class AdminSharedPipesModule {}
