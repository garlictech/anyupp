import { EMPTY, Observable } from 'rxjs';
import { User } from '@bgap/domain';
import { catchError } from 'rxjs/operators';
import { CrudSdk } from '@bgap/crud-gql/api';

interface Params {
  sdk: CrudSdk;
  id: string;
}

export const getUser = ({
  sdk,
  id,
}: Params): Observable<User | null | undefined> => {
  return sdk.GetUser({ id }).pipe(
    catchError(error => {
      console.error('Error in getUser: ', error);
      return EMPTY;
    }),
  );
};
