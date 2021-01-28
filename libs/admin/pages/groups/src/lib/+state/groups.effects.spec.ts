import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { GroupsEffects } from './groups.effects';
import * as GroupsActions from './groups.actions';

describe('GroupsEffects', () => {
  let actions: Observable<any>;
  let effects: GroupsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        GroupsEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.get(GroupsEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: GroupsActions.init() });

      const expected = hot('-a-|', {
        a: GroupsActions.loadGroupsSuccess({ groups: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
