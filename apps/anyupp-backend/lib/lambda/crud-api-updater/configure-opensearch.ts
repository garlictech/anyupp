import { OpenSearch } from 'aws-sdk';
import { CrudApiConfig } from '@bgap/crud-gql/api';
import { defer, from, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { DomainStatus } from 'aws-sdk/clients/opensearch';

const openSearch = new OpenSearch({
  apiVersion: '2021-01-01',
});

const domainName = CrudApiConfig.openSearchArn.split('/')[1];

const accessPolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Principal: {
        AWS: '*',
      },
      Action: 'es:ESHttp*',
      Resource: `${CrudApiConfig.openSearchArn}/*`,
    },
  ],
};

export const configureOpenSearchPolicy = () =>
  defer(() =>
    from(openSearch.describeDomain({ DomainName: domainName }).promise()),
  ).pipe(
    map(response => {
      console.log(response);
      return response.DomainStatus;
    }),
    filter(
      domainStatus => domainStatus.AdvancedSecurityOptions?.Enabled == true,
    ),
    switchMap((domainStatus: DomainStatus) =>
      from(
        openSearch
          .updateDomainConfig({
            DomainName: domainStatus.DomainName,
            AccessPolicies: JSON.stringify(accessPolicy),
          })
          .promise(),
      ),
    ),
    catchError(err => {
      console.warn('Policy attachment was not successful: ', err);
      return of(true);
    }),
  );
