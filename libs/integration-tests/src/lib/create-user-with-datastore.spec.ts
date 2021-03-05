import {
  awsmobile,
  Poi,
  PoiSource,
  PoiSourceObject,
  TextualDescription,
  TextualDescriptionType
} from '@gtrack/amplify-user';
import Amplify from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import { from } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import * as fp from 'lodash/fp';

Amplify.configure(awsmobile);

describe('Testing POI from datastore', () => {
  test('It should create a POI', done => {
    let savedPoi: Poi;

    from(
      DataStore.save(
        new Poi({
          elevation: 123.45,
          lat: 123.45,
          lon: 123.45,
          types: [],
          description: [
            new TextualDescription({
              languageKey: 'Lorem ipsum dolor sit amet',
              title: 'Lorem ipsum dolor sit amet',
              summary: 'Lorem ipsum dolor sit amet',
              fullDescription: 'Lorem ipsum dolor sit amet',
              type: TextualDescriptionType.MARKDOWN
            })
          ],
          tags: [],
          sourceObject: [
            new PoiSourceObject({
              objectType: PoiSource.GOOGLE,
              languageKey: 'Lorem ipsum dolor sit amet',
              objectId: 'Lorem ipsum dolor sit amet',
              url: 'Lorem ipsum dolor sit amet'
            })
          ],
          address: 'Lorem ipsum dolor sit amet',
          phoneNumber: 'Lorem ipsum dolor sit amet',
          openingHours: 'Lorem ipsum dolor sit amet'
        })
      )
    )
      .pipe(
        tap(poi => {
          expect(fp.omit('id', poi)).toMatchSnapshot();
          savedPoi = poi;
        }),
        switchMap(({ id }) => from(DataStore.query(Poi, id))),
        tap(poi => expect(poi).toEqual(savedPoi)),
        switchMap(poi =>
          from(
            DataStore.save(
              Poi.copyOf(poi as Poi, updated => {
                updated.address = 'CHANGED ADDRESS';
              })
            )
          )
        ),
        switchMap(({ id }) => from(DataStore.query(Poi, id))),
        tap(poi => {
          expect(fp.omit('id', poi)).toMatchSnapshot();
        }),
        switchMap(poi =>
          from(DataStore.delete(poi ?? { id: 'SOMETHING IS WRONG' }))
        ),
        switchMap(() => from(DataStore.query(Poi, savedPoi.id))),
        tap(poi => expect(poi).toBeUndefined())
      )
      .subscribe(() => done());
  }, 30000);
});
