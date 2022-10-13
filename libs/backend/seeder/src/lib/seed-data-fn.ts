import {
  productCategoryFixture,
  unitFixture,
  getProductComponent,
  getComponentSet,
  freiUnitId,
  freiUnit,
} from '@bgap/shared/fixtures';
import { RequiredId } from '@bgap/shared/types';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { CreateProductCategoryInput, CrudSdk } from '@bgap/crud-gql/api';
import {
  Allergen,
  CreateAdminUserInput,
  CreateOrderInput,
  CreateProductComponentInput,
  CreateProductComponentSetInput,
  CreateUnitProductInput,
  CreateUserInput,
  CreateVariantInput,
  ProductType,
  ServingMode,
} from '@bgap/domain';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

export interface SeederDependencies {
  crudSdk: CrudSdk;
  userPoolId: string;
  consumerUserPoolId: string;
  cognitoidentityserviceprovider: CognitoIdentityServiceProvider;
}

export type DeletableInput<T> = Omit<T, 'id'> & { id: string };

const deleteCreate = <T, K>(
  deleteOperation: () => Observable<T>,
  createOperation: () => Observable<K>,
): Observable<K> =>
  deleteOperation().pipe(
    catchError(error => {
      console.warn('Problem with SEED data DELETION: ', error);
      return of('STILL TRY TO CREATE IT PLEASE');
    }),
    switchMap(() => createOperation()),
  );

export const createConsumerUser = () => (deps: SeederDependencies) => {
  console.debug('createConsumerUser');

  const input: CreateUserInput = {
    id: 'test-alice',
    name: 'Mekk Elek',
    email: 'testuser+alice@anyupp.com',
    phone: '1234',
  };
  return deleteCreate(
    () => deps.crudSdk.DeleteUser({ input: { id: input.id ?? '' } }),
    () => deps.crudSdk.CreateUser({ input }),
  );
};

export const createAdminUser =
  (adminUserId: string, email: string, phone: string) =>
  (deps: SeederDependencies) => {
    console.debug('createAdminUser', {
      adminUserId,
      email,
    });
    const input: DeletableInput<CreateAdminUserInput> = {
      id: adminUserId,
      name: adminUserId,
      email,
      phone,
      profileImage:
        'https://ocdn.eu/pulscms-transforms/1/-rxktkpTURBXy9jMzIxNGM4NWI2NmEzYTAzMjkwMTQ1NGMwZmQ1MDE3ZS5wbmeSlQMAAM0DFM0Bu5UCzQSwAMLD',
    };
    return deleteCreate(
      () => deps.crudSdk.DeleteAdminUser({ input: { id: input.id ?? '' } }),
      () => deps.crudSdk.CreateAdminUser({ input }),
    );
  };

export const createTestUnit = (deps: SeederDependencies) => {
  console.debug('createTestUnit');
  const input = unitFixture.kesdobalo;
  return deleteCreate(
    () => deps.crudSdk.DeleteUnit({ input: { id: input.id ?? '' } }),
    () => deps.crudSdk.CreateUnit({ input }),
  );
};

export const seedDebrecenUnit = (deps: SeederDependencies) => {
  console.debug('createDebrecenUnit');
  const unit = {
    ...unitFixture.kesdobalo,
    id: 'civis-unit',
    name: 'Cívis Búfelejtő',
    location: {
      lat: 47.53,
      lon: 21.639167,
    },
    coverBanners: [
      {
        imageUrl:
          'http://img6.lapunk.hu/tarhely/furediturazok/galeria/787689.jpg',
      },
    ],
  };

  const category: RequiredId<CreateProductCategoryInput> = {
    id: 'civis-product-category',
    ownerEntity: unit.id,
    name: {
      hu: `Tüskék`,
      en: `Death shots`,
    },
    image: 'https://i.ytimg.com/vi/K4LhyA-xnEs/maxresdefault.jpg',
    position: 3,
  };

  const product = {
    id: 'civis_product_beer',
    unitId: unit.id,
    laneId: 'lane_01',
    isVisible: true,
    takeaway: false,
    supportedServingModes: [ServingMode.takeaway, ServingMode.inplace],
    position: 0,
    takeawayTax: 20,
    tax: 27,
    image: 'https://img-9gag-fun.9cache.com/photo/aV7EwOP_460s.jpg',
    name: {
      de: 'Vakcina',
      en: 'Vakcina',
      hu: 'Vakcina',
    },
    productCategoryId: category.id,
    productType: ProductType.drink,
    description: {
      de: 'Ezt idd',
      en: 'Ezt idd',
      hu: 'Ezt idd',
    },
    configSets: [],
  };

  const variant = {
    id: 'civis_product_beer_variant',
    isAvailable: true,
    price: 150,
    position: 1,
    pack: {
      size: 1,
      unit: 'adag',
    },
    variantName: {
      en: 'piece',
      hu: 'adag',
    },
    unitProductVariantsId: product.id,
  };

  return deleteCreate(
    () => deps.crudSdk.DeleteUnit({ input: { id: unit.id ?? '' } }),
    () => deps.crudSdk.CreateUnit({ input: unit }),
  ).pipe(
    switchMap(() =>
      deleteCreate(
        () =>
          deps.crudSdk.DeleteProductCategory({
            input: {
              id: category.id,
            },
          }),
        () =>
          deps.crudSdk.CreateProductCategory({
            input: category,
          }),
      ),
    ),
    switchMap(() =>
      deleteCreate(
        () =>
          deps.crudSdk.DeleteUnitProduct({
            input: {
              id: product.id,
            },
          }),
        () =>
          deps.crudSdk.CreateUnitProduct({
            input: product,
          }),
      ),
    ),
    switchMap(() =>
      deleteCreate(
        () =>
          deps.crudSdk.DeleteVariant({
            input: {
              id: variant.id,
            },
          }),
        () =>
          deps.crudSdk.CreateVariant({
            input: variant,
          }),
      ),
    ),
  );
};
export const createTestProductCategories = () => (deps: SeederDependencies) => {
  console.debug('createTestProductCategories');

  return deleteCreate(
    () =>
      deps.crudSdk.DeleteProductCategory({
        input: { id: productCategoryFixture.seededProductCategory_01.id },
      }),
    () =>
      deps.crudSdk.CreateProductCategory({
        input: productCategoryFixture.seededProductCategory_01,
      }),
  ).pipe(
    switchMap(() =>
      deleteCreate(
        () =>
          deps.crudSdk.DeleteProductCategory({
            input: { id: productCategoryFixture.seededProductCategory_02.id },
          }),
        () =>
          deps.crudSdk.CreateProductCategory({
            input: productCategoryFixture.seededProductCategory_02,
          }),
      ),
    ),
    switchMap(() =>
      deleteCreate(
        () =>
          deps.crudSdk.DeleteProductCategory({
            input: { id: productCategoryFixture.seededProductCategory_03.id },
          }),
        () =>
          deps.crudSdk.CreateProductCategory({
            input: productCategoryFixture.seededProductCategory_03,
          }),
      ),
    ),
  );
};

/**
 * Create UnitProduct and GeneratedProducts too
 */
export const createTestUnitProduct =
  (unitId: string) => (deps: SeederDependencies) => {
    console.debug('createTestUnitProduct');
    const input: DeletableInput<CreateUnitProductInput> = {
      id: 'kesdobalo_product_hambi',
      unitId: unitId,
      laneId: 'lane_01',
      isVisible: true,
      takeaway: false,
      supportedServingModes: [ServingMode.takeaway, ServingMode.inplace],
      position: 0,
      takeawayTax: 20,
      tax: 27,
      image:
        'https://archive.canadianbusiness.com/wp-content/uploads/2013/04/oldhamburger.jpg',
      name: {
        de: 'Hamburger',
        en: 'Hamburger',
        hu: 'Hamburger',
      },
      productCategoryId: 'seeded_product_category_c1_1_id',
      productType: ProductType.food,
      allergens: [
        Allergen.egg,
        Allergen.gluten,
        Allergen.mustard,
        Allergen.milk,
        Allergen.soya,
        Allergen.fish,
        Allergen.sesame,
      ],
      description: {
        de: 'laktató szendvics',
        en: 'laktató szendvics',
        hu: 'laktató szendvics',
      },
      configSets: [],
    };

    const variant: DeletableInput<CreateVariantInput> = {
      id: 'kesdobalo_product_hambi_variant',
      unitProductVariantsId: input.id,
      isAvailable: true,
      price: 150,
      position: 1,
      pack: {
        size: 1,
        unit: 'db',
      },
      variantName: {
        en: 'piece',
        hu: 'darab',
      },
    };

    return forkJoin([
      deleteCreate(
        () => deps.crudSdk.DeleteUnitProduct({ input: { id: input.id ?? '' } }),
        () => deps.crudSdk.CreateUnitProduct({ input }),
      ),
      deleteCreate(
        () => deps.crudSdk.DeleteVariant({ input: { id: variant.id ?? '' } }),
        () => deps.crudSdk.CreateVariant({ input: variant }),
      ),
    ]);
  };

export const createComponentSets = (deps: SeederDependencies) => {
  console.debug('createComponentSets');

  const deleteCreateProductComponent = (
    comp: RequiredId<CreateProductComponentInput>,
  ) =>
    deleteCreate(
      () =>
        deps.crudSdk.DeleteProductComponent({
          input: { id: comp.id },
        }),
      () =>
        deps.crudSdk.CreateProductComponent({
          input: comp,
        }),
    );

  const deleteCreateProductComponentSet = (
    compSet: RequiredId<CreateProductComponentSetInput>,
  ) =>
    deleteCreate(
      () =>
        deps.crudSdk.DeleteProductComponentSet({
          input: { id: compSet.id },
        }),
      () =>
        deps.crudSdk.CreateProductComponentSet({
          input: compSet,
        }),
    );

  const productComponent = getProductComponent({
    id: 'kesdobalo_product_component',
    ownerEntity: unitFixture.kesdobalo.id,
  });

  return deleteCreateProductComponent(productComponent).pipe(
    switchMap(() =>
      deleteCreateProductComponentSet(
        getComponentSet({
          id: 'kesdobalo_product_component_set',
          unitId: unitFixture.kesdobalo.id,
          itemIds: [productComponent.id],
        }),
      ),
    ),
  );
};

export const seedFreiRKeeperUnit = (deps: SeederDependencies) =>
  forkJoin([
    deleteCreate(
      () => deps.crudSdk.DeleteUnit({ input: { id: freiUnitId } }),
      () =>
        deps.crudSdk
          .CreateUnit({
            input: freiUnit,
          })
          .pipe(
            switchMap(unit =>
              deps.crudSdk.UpdateUnitRKeeperData({
                input: {
                  unitId: unit?.id || 'wtf',
                  waiterOrderId: '1040917',
                },
              }),
            ),
          ),
    ),
  ]);

export const placeOrderToSeat = (
  orderInput: CreateOrderInput,
  table: string,
  seat: string,
) => ({
  ...orderInput,
  place: {
    table,
    seat,
  },
});
