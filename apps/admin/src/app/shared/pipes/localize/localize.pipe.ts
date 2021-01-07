import { take } from 'rxjs/operators';
import { IState } from 'src/app/store';
import { currentUserSelectors } from 'src/app/store/selectors';

import { Pipe, PipeTransform } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { DEFAULT_LANG } from '../../const';

@Pipe({
  name: 'localize',
  pure: false,
})
export class LocalizePipe implements PipeTransform {
  constructor(private _store: Store<IState>) {}

  transform(value: unknown): string {
    if (!value) {
      return;
    }

    let selectedLang;
    this._store
      .pipe(select(currentUserSelectors.getSelectedLanguage), take(1))
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
