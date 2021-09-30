import CognitoIdentityServiceProvider, {
  ListUsersRequest,
} from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { filterNullish } from '@bgap/shared/utils';
import { defer, EMPTY, from } from 'rxjs';
import { expand, map, reduce, shareReplay } from 'rxjs/operators';

import { ReportDeps, ReportUserData } from './interfaces';
import { fourWeeksAgo, startOfThisYear } from './report-utils';

export const getCognitoUsersStream = (deps: ReportDeps) => {
  const cisp = new CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18',
    region: deps.region,
  });

  const params: ListUsersRequest = {
    Limit: 60,
    AttributesToGet: ['email'],
    UserPoolId: deps.userPoolId,
  };

  // List users from the specified interval
  const usersCreatedFrom = new Date(
    Math.min(startOfThisYear(deps.reportDate), fourWeeksAgo(deps.reportDate)),
  ).getTime();

  const getCognitoPage = (PaginationToken?: string) =>
    defer(() => from(cisp.listUsers({ ...params, PaginationToken }).promise()));

  return getCognitoPage().pipe(
    expand(result =>
      result?.PaginationToken ? getCognitoPage(result.PaginationToken) : EMPTY,
    ),
    map(page =>
      (page?.Users ?? [])
        .filter(
          u =>
            (u.UserCreateDate?.getTime() || 0) >= usersCreatedFrom &&
            u.Username &&
            u.Attributes?.[0]?.Value,
        )
        .map(u => ({
          id: u.Username || '',
          ucd: u.UserCreateDate?.getTime(),
          email: u.Attributes?.[0]?.Value || '',
        })),
    ),
    filterNullish<ReportUserData[]>(),
    // concatMap(x => from(x)),
    reduce(
      (acc: ReportUserData[], res: ReportUserData[]) => acc.concat(res),
      [],
    ),
    shareReplay(1),
  );
};
