import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { DEFAULT_LANG } from './shared/const';

@Component({
  selector: 'bgap-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  constructor(private _translateService: TranslateService) {
    // This language will be used as a fallback when a translation isn't found in the current language
    this._translateService.setDefaultLang(DEFAULT_LANG);

    // The lang to use, if the lang isn't available, it will use the current loader to get them
    this._translateService.use(DEFAULT_LANG);
  }
}
