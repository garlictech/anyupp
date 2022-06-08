import { RequiredId } from '@bgap/shared/types';
import { CreateGeneratedProductCategoryInput } from '@bgap/domain';
import { testIdPrefix } from './common';

const getGeneratedProductCategory = ({
  id,
  unitId,
  productCategoryId,
}: {
  id: string;
  unitId: string;
  productCategoryId: string;
}): RequiredId<CreateGeneratedProductCategoryInput> => ({
  ...generatedProductCategoryBase,
  id,
  unitId,
  productCategoryId,
});

const generatedProductCategoryBase: RequiredId<CreateGeneratedProductCategoryInput> =
  {
    id: `${testIdPrefix}generatedProduct_id_`,
    unitId: 'unitId_',
    productCategoryId: 'productCategoryId_',
    productNum: 1,
  };

export const generatedProductCategoryFixture = {
  base: generatedProductCategoryBase,
  getGeneratedProductCategory,
};
