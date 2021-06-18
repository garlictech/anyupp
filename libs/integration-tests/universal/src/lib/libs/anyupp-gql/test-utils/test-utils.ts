export const getSortedProductCatIds = (
  input: Array<{ productCategoryId: string }>,
) => input.map(x => x.productCategoryId).sort((a, b) => (a > b ? 1 : -1));
