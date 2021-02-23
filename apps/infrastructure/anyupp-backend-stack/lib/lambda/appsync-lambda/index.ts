import { Observable, of } from 'rxjs';
import { Context, Handler } from 'aws-lambda';

console.log('Starting hellobello lambda');

export interface HellobelloRequest {
  name: string;
}

export interface AnyuppRequest {
  fieldName: string;
  payload: unknown;
}

const hellobelloService = {
  getGreetings(request: HellobelloRequest): Observable<string> {
    return of(`Hellobello, ${request.name}`);
  },
};

export const handler: Handler<AnyuppRequest, unknown> = async (
  event: AnyuppRequest,
  _: Context,
): Promise<unknown> => {
  console.log('**** Executing hellobello lambda with event', event);

  switch (event.fieldName) {
    case 'hellobello': {
      console.log('Handling hellobello');

      return hellobelloService
        .getGreetings(event.payload as HellobelloRequest)
        .toPromise();
    }
    default:
      throw 'up';
  }
};
