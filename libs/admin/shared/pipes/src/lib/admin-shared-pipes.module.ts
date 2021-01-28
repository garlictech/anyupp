import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CurrencyFormatterPipe } from './currency-formatter';
import { LocalizePipe } from './localize';
import { LocalizedDatePipe } from './localized-date';
import { ObjectToArrayPipe } from './object-to-array';
import { RoleEntityNamesPipe } from './role-entity-names';
import { SecToHmsPipe } from './sec-to-hms';

const PIPES = [
  LocalizePipe,
  LocalizedDatePipe,
  ObjectToArrayPipe,
  RoleEntityNamesPipe,
  CurrencyFormatterPipe,
  SecToHmsPipe,
];

@NgModule({
  declarations: [...PIPES],
  exports: [...PIPES],
  providers: [LocalizePipe, CurrencyFormatterPipe],
  imports: [CommonModule],
})
export class AdminSharedPipesModule {}
