import { ListUsersRequest } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { filterNullish } from '@bgap/shared/utils';
import { defer, EMPTY, from } from 'rxjs';
import { expand, map, reduce, shareReplay } from 'rxjs/operators';
import { ReportDeps, ReportUserData } from './interfaces';
import { fourWeeksAgo, startOfThisYear, endOfDay } from './report-utils';

export const cognitoUsersStream$ = (deps: ReportDeps) => {
  console.error('deps', deps);
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
  const usersCreatedTo = new Date(endOfDay(deps.reportDate)).getTime();

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
            (u.UserCreateDate?.getTime() || 0) <= usersCreatedTo &&
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
    reduce(
      (acc: ReportUserData[], res: ReportUserData[]) => acc.concat(res),
      [],
    ),
    shareReplay(1),
  );
};
