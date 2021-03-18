import { ILocalizedItem } from '@bgap/shared/types';
import { take } from 'rxjs/operators';

import { Pipe, PipeTransform } from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { DEFAULT_LANG } from '@bgap/admin/shared/utils';
import { select, Store } from '@ngrx/store';

@Pipe({
  name: 'localize',
  pure: false,
})
export class LocalizePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private _store: Store<any>) {}

  transform(value: ILocalizedItem<string>): string {
    if (!value) {
      return '';
    }

    let selectedLang = undefined;
    this._store
      .pipe(select(loggedUserSelectors.getSelectedLanguage), take(1))
      .subscribe((lang: string | null | undefined): void => {
        selectedLang = (lang || DEFAULT_LANG).substr(0, 2);
      });

    return selectedLang
      ? value[selectedLang]
      : value.en
      ? value.en
      : Object.values(value).filter(
          (v: string): boolean => typeof v === 'string' && v.length > 0,
        )[0] || '';
  }
}
