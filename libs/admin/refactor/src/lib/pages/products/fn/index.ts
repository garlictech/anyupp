import { CreateUnitProductInput, UpdateUnitProductInput } from '@bgap/domain';
import { Product } from '@bgap/shared/types';

// Send null instead of empty strings (avoid type failure)
export const handleEmptyPackaginFees = (
  fromInput: CreateUnitProductInput | UpdateUnitProductInput,
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

export const foundIn = (searchValue: string, p: Product) => {
  const fields = [
    p.name?.hu ?? '',
    p.name?.en ?? '',
    p.name?.de ?? '',
    p.description?.hu ?? '',
    p.description?.en ?? '',
    p.description?.de ?? '',
  ];

  return searchValue
    ? fields.some(i => i.toLowerCase().includes(searchValue.toLowerCase()))
    : true;
};
