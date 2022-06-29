import { OpenSearch } from 'aws-sdk';
import { CrudApiConfig } from '@bgap/crud-gql/api';
import { throwIfEmptyValue } from '@bgap/shared/utils';
import { defer, from, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

const openSearch = new OpenSearch({
  apiVersion: '2021-01-01',
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
    filter(
      domainStatus => domainStatus.AdvancedSecurityOptions?.Enabled == true,
    ),
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
    catchError(err => {
      console.warn('Policy attachment was not successful: ', err);
      return of({});
    }),
  );
