import { OpenSearch } from 'aws-sdk';
import { CrudApiConfig } from '@bgap/crud-gql/api';
import { throwIfEmptyValue } from '@bgap/shared/utils';
import { defer, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

const openSearch = new OpenSearch({
  apiVersion: '2017-07-25',
});

const domainName = CrudApiConfig.openSearchEndpoint.split('/')[1];

const accessPolicies = [
  {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          AWS: '*',
        },
        Action: 'es:ESHttp*',
        Resource: `${CrudApiConfig.openSearchEndpoint}/*`,
      },
    ],
  },
];

export const configureOpenSearchPolicy = () =>
  defer(() =>
    from(openSearch.describeDomain({ DomainName: domainName }).promise()),
  ).pipe(
    map(response => response.DomainStatus),
    throwIfEmptyValue(),
    switchMap(() =>
      from(
        openSearch
          .updateDomainConfig({
            DomainName: domainName,
            AccessPolicies: JSON.stringify(accessPolicies),
          })
          .promise(),
      ),
    ),
    catchError(err =>
      JSON.stringify(err, null, 2).includes('OpenSearch access policies')
        ? of(true)
        : throwError(err),
    ),
  );
