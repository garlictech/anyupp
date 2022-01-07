/*
import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { AppCoreEffects } from './app-core.effects';
import * as AppCoreActions from './app-core.actions';

describe('AppCoreEffects', () => {
  let actions: Observable<any>;
  let effects: AppCoreEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        AppCoreEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(AppCoreEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: AppCoreActions.init() });

      const expected = hot('-a-|', {
        a: AppCoreActions.loadAppCoreSuccess({ appCore: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
*/
