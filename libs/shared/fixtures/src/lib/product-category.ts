import { RequiredId } from '@bgap/shared/types';
import { CreateProductCategoryInput } from '@bgap/domain';
import { unitFixture } from './unit';
import { seededIdPrefix, testIdPrefix } from './common';

const productCategoryId_01 = `${seededIdPrefix}product_category_c1_1_id`;
const productCategoryId_02 = `${seededIdPrefix}product_category_c1_2_id`;
const productCategoryId_03 = `${seededIdPrefix}product_category_c1_3_id`;

const productCategoryBase: RequiredId<CreateProductCategoryInput> = {
  id: `${testIdPrefix}generatedProduct_id_`,
  ownerEntity: unitFixture.kesdobalo.id,
  name: { en: 'PRODUCT_CATEGORY' },
  description: { en: 'DESCRIPTION' },
  image: 'IMAGE',
  position: 0,
};

const seededProductCategory_01: RequiredId<CreateProductCategoryInput> = {
  id: productCategoryId_01,
  ownerEntity: unitFixture.kesdobalo.id,
  name: {
    hu: `Hamburgerek`,
    en: `Hamburgers`,
  },
  description: {
    hu: `Hamburgerek leírása`,
    en: `Hamburgers description`,
  },
  image: 'https://picsum.photos/100?random=1',
  position: 1,
};

const seededProductCategory_02: RequiredId<CreateProductCategoryInput> = {
  id: productCategoryId_02,
  ownerEntity: unitFixture.kesdobalo.id,
  name: {
    hu: `Alkoholmententes italok`,
    en: `Non-alcoholic drinks`,
  },
  description: {
    hu: `Alkoholmententes italok leírása`,
    en: `Non-alcoholic drinks description`,
  },
  image: 'https://picsum.photos/100?random=2',
  position: 2,
};

const seededProductCategory_03: RequiredId<CreateProductCategoryInput> = {
  id: productCategoryId_03,
  ownerEntity: unitFixture.kesdobalo.id,
  name: {
    hu: `Sörök`,
    en: `Beers`,
  },
  description: {
    hu: `Sörök leírása`,
    en: `Beers description`,
  },
  image: 'https://picsum.photos/100?random=3',
  position: 3,
};
export const productCategoryFixture = {
  seededProductCategory_01,
  seededProductCategory_02,
  seededProductCategory_03,
  productCategoryBase,
};
