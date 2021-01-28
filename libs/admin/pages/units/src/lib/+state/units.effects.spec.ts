import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { UnitsEffects } from './units.effects';
import * as UnitsActions from './units.actions';

describe('UnitsEffects', () => {
  let actions: Observable<any>;
  let effects: UnitsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        UnitsEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.get(UnitsEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: UnitsActions.init() });

      const expected = hot('-a-|', {
        a: UnitsActions.loadUnitsSuccess({ units: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
