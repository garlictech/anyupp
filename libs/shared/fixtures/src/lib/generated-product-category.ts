import * as CrudApi from '@bgap/crud-gql/api';
import { RequiredId } from '@bgap/shared/types';
import { testIdPrefix } from './common';

const getGeneratedProductCategory = ({
  id,
  unitId,
  productCategoryId,
}: {
  id: string;
  unitId: string;
  productCategoryId: string;
}): RequiredId<CrudApi.CreateGeneratedProductCategoryInput> => ({
  ...generatedProductCategoryBase,
  id,
  unitId,
  productCategoryId,
});

const generatedProductCategoryBase: RequiredId<CrudApi.CreateGeneratedProductCategoryInput> =
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
