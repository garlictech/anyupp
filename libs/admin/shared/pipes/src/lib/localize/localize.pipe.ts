import { take } from 'rxjs/operators';

import { Pipe, PipeTransform } from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/logged-user';
import { DEFAULT_LANG } from '@bgap/admin/shared/utils';
import { select, Store } from '@ngrx/store';

@Pipe({
  name: 'localize',
  pure: false,
})
export class LocalizePipe implements PipeTransform {
  constructor(private _store: Store<any>) {}

  transform(value: unknown): string {
    if (!value) {
      return;
    }

    let selectedLang;
    this._store
      .pipe(select(loggedUserSelectors.getSelectedLanguage), take(1))
      .subscribe((lang: string): void => {
        selectedLang = (lang || DEFAULT_LANG).substr(0, 2);
      });

    return (
      // Selected
      value[selectedLang] ||
      // Or EN fallback
      value['en'] ||
      // Or get the first not null string
      Object.values(value).filter(
        (v: string): boolean => typeof v === 'string' && v.length > 0
      )[0] ||
      // Or empty...
      ''
    );
  }
}
