import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { ChainsEffects } from './chains.effects';
import * as ChainsActions from './chains.actions';

describe('ChainsEffects', () => {
  let actions: Observable<any>;
  let effects: ChainsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        ChainsEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.get(ChainsEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: ChainsActions.init() });

      const expected = hot('-a-|', {
        a: ChainsActions.loadChainsSuccess({ chains: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
