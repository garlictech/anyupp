import * as CrudApi from '@bgap/crud-gql/api';
import { RequiredId } from '@bgap/shared/types';
import { chainFixture } from './chain';
import { seededIdPrefix, testIdPrefix } from './common';

const productCategory_seeded_01 = `${seededIdPrefix}product_category_c1_1_id`;
const productCategory_seeded_02 = `${seededIdPrefix}product_category_c1_2_id`;
const seededChainId_01 = chainFixture.chainId_seeded_01;

const productCategoryBase: RequiredId<CrudApi.CreateProductCategoryInput> = {
  id: `${testIdPrefix}generatedProduct_id_`,
  chainId: seededChainId_01,
  name: { en: 'PRODUCT_CATEGORY' },
  description: { en: 'DESCRIPTION' },
  image: 'IMAGE',
  position: 0,
};

export const productCategoryFixture = {
  productCategory_seeded_01,
  productCategory_seeded_02,
  productCategoryBase,
};
