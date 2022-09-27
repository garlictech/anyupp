import { CrudSdk } from '@bgap/crud-gql/api';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { getUser } from './getUser';
import { getLastSeenValidToken } from './getLastSeenValidToken';

interface Params {
  sdk: CrudSdk;
  id: string;
}

export const getFCMTokenForUser = (
  params: Params,
): Observable<string | null> => {
  return getUser(params).pipe(map(getLastSeenValidToken), take(1));
};
