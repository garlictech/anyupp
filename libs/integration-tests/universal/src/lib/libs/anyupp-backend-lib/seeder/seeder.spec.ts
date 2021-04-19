import {
  createTestRoleContext,
  seedAdminUser,
  seedBusinessData,
} from '@bgap/anyupp-backend-lib';
import {
  createTestChain,
  createTestChainProduct,
} from '@bgap/anyupp-backend-lib';
import { AWS_CRUD_CONFIG } from '@bgap/shared/graphql/api-client';
import { switchMap } from 'rxjs/operators';

describe.skip('Seeder test', () => {
  describe('DB seeder', () => {
    it.skip('should createTestChain work', done => {
      createTestChain(1).subscribe({
        next(result: any) {
          expect(result).toHaveProperty('createChain');
          const {
            createdAt,
            updatedAt,
            ...justCreatedObject
          } = result.createChain;
          expect(createdAt).not.toBeUndefined();
          expect(updatedAt).not.toBeUndefined();
          expect(justCreatedObject).toMatchSnapshot();
          done();
        },
      });
    }, 25000);

    it.skip('should createTestChainProduct work', done => {
      createTestChainProduct(1, 1, 1).subscribe({
        next(result: any) {
          expect(result).toHaveProperty('createChainProduct');
          const {
            createdAt,
            updatedAt,
            ...justCreatedObject
          } = result.createChainProduct;
          expect(createdAt).not.toBeUndefined();
          expect(updatedAt).not.toBeUndefined();
          expect(justCreatedObject).toMatchSnapshot();
          done();
        },
      });
    }, 25000);

    it.skip('should the seedBusinessData function run successfully', done => {
      seedBusinessData('USER_ID').subscribe({
        complete() {
          done();
        },
      });
    }, 25000);
    it.skip('should the createTestRoleContext function run successfully', done => {
      createTestRoleContext(1, 1, 1, 1).subscribe({
        complete() {
          done();
        },
      });
    }, 25000);
  });

  describe('AdminUser seeder', () => {
    it('Admin user create', done => {
      seedAdminUser(AWS_CRUD_CONFIG.aws_user_pools_id).subscribe({
        complete() {
          done();
        },
      });
    }, 25000);
  });

  it('should run complete seeder', done => {
    seedAdminUser(AWS_CRUD_CONFIG.aws_user_pools_id)
      .pipe(switchMap(userId => seedBusinessData(userId)))
      // .pipe(
      //   mapTo('SUCCESS'),
      //   catchError((error: AWSError) => {
      //     console.log("Probably 'normal' error: ", error);
      //     return of('SUCCESS');
      //   }),
      // ),
      // ])
      .subscribe({
        complete() {
          done();
        },
      });
  }, 25000);
});
