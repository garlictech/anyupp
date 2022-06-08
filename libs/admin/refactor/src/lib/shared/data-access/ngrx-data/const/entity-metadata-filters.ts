import { LocalizedItem } from '@bgap/domain';

// Return true, if no name filter has been specified
export const localizedItemFilter =
  <T>(fieldName: keyof T, lang: string, toFind?: LocalizedItem | null) =>
  (item: T) =>
    toFind?.[<keyof LocalizedItem>lang]
      ? -1 <
        (
          (<LocalizedItem>item?.[fieldName])?.[
            <keyof LocalizedItem>lang
          ]?.toLocaleLowerCase() || ''
        ).indexOf(
          (toFind?.[<keyof LocalizedItem>lang] || '').toLocaleLowerCase(),
        )
      : true;

export const simpleFilter =
  <T>(property: keyof T, fallback: boolean, toFind?: unknown) =>
  (item: T) =>
    toFind ? <unknown>item[property] === toFind : fallback;
