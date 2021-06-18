import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { createUnitProduct } from './create-unit-product.resolver';
import { ProductResolverDeps } from './utils';

// interface WithAuthenticatedUser {
//   userId: string;
// }
export type CreateUnitProductRequest /* WithAuthenticatedUser & */ =
  AnyuppApi.CreateUnitProductInput;

export const productRequestHandler = (deps: ProductResolverDeps) => ({
  createUnitProduct: (requestPayload: CreateUnitProductRequest) => {
    return createUnitProduct(requestPayload)(deps).toPromise();
  },
});
