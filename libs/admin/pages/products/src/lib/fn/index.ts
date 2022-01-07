import * as CrudApi from '@bgap/crud-gql/api';

// Send null instead of empty strings (avoid type failure)
export const handleEmptyPackaginFees = (
  fromInput: CrudApi.CreateUnitProductInput | CrudApi.UpdateUnitProductInput,
) => ({
  ...fromInput,
  variants: fromInput.variants?.map(v => ({
    ...v,
    netPackagingFee: v?.netPackagingFee || null,
  })),
  configSets: fromInput.configSets?.map(c => ({
    ...c,
    items: c?.items.map(i => ({
      ...i,
      netPackagingFee: i?.netPackagingFee || null,
    })),
  })),
});
