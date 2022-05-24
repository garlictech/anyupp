import * as CrudApi from '@bgap/crud-gql/api';

// Return true, if no name filter has been specified
export const localizedItemFilter =
  <T>(
    fieldName: keyof T,
    lang: string,
    toFind?: CrudApi.LocalizedItem | null,
  ) =>
  (item: T) =>
    toFind?.[<keyof CrudApi.LocalizedItem>lang]
      ? -1 <
        (
          (<CrudApi.LocalizedItem>item?.[fieldName])?.[
            <keyof CrudApi.LocalizedItem>lang
          ]?.toLocaleLowerCase() || ''
        ).indexOf(
          (
            toFind?.[<keyof CrudApi.LocalizedItem>lang] || ''
          ).toLocaleLowerCase(),
        )
      : true;

export const simpleFilter =
  <T>(property: keyof T, fallback: boolean, toFind?: unknown) =>
  (item: T) =>
    toFind ? <unknown>item[property] === toFind : fallback;
