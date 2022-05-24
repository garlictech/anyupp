import { CommonModule } from '@angular/common';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { LayoutService } from './utils';
import { CustomNbIconLibraries } from './utils/custom-icon-libraries.service';

export const NB_CORE_PROVIDERS = [
  LayoutService,
  { provide: NbIconLibraries, useExisting: CustomNbIconLibraries },
];

@NgModule({
  imports: [CommonModule],

  declarations: [],
})
export class AdminUiCoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule: AdminUiCoreModule,
    private iconLibraries: NbIconLibraries,
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
    this.registerMaterialIcons();
  }

  static forRoot(): ModuleWithProviders<AdminUiCoreModule> {
    return {
      ngModule: AdminUiCoreModule,
      providers: [...NB_CORE_PROVIDERS],
    };
  }

  // Google Material Icon list: https://fonts.google.com/icons?selected=Material+Icons
  private registerMaterialIcons() {
    this.iconLibraries.registerFontPack('material-icons', {
      packClass: 'material-icons',
      ligature: true,
    });
    this.iconLibraries.setDefaultPack('material-icons');
  }
}
