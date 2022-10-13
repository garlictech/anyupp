import { Product } from '@bgap/shared/types';

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
