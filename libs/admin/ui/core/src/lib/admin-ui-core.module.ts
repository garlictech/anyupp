import { CommonModule } from '@angular/common';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { LayoutService } from './utils';

export const NB_CORE_PROVIDERS = [LayoutService];

@NgModule({
  imports: [CommonModule],

  declarations: [],
})
export class AdminUiCoreModule {
  constructor(@Optional() @SkipSelf() parentModule: AdminUiCoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<AdminUiCoreModule> {
    return {
      ngModule: AdminUiCoreModule,
      providers: [...NB_CORE_PROVIDERS],
    };
  }
}
