import {
  createTestAdminRoleContext,
  createTestRoleContext,
  createTestUnitProduct,
  seedAdminUser,
  seedBusinessData,
} from '@bgap/anyupp-backend-lib';
import {
  createTestChain,
  createTestChainProduct,
} from '@bgap/anyupp-backend-lib';
import { AWS_CRUD_CONFIG } from '@bgap/shared/graphql/api-client';
import { AWSError } from 'aws-sdk';
import { of, throwError } from 'rxjs';
import { catchError, switchMap, delay } from 'rxjs/operators';

describe('Seeder test', () => {
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

    it.skip('should createTestUnitProduct work', done => {
      createTestUnitProduct(1, 1, 1, 1, 1).subscribe({
        next(result: any) {
          expect(result).toHaveProperty('unitProduct');
          expect(result).toHaveProperty('generatedProduct');
          const {
            createdAt: ca01,
            updatedAt: ua01,
            ...justCreatedUnitProduct
          } = result.unitProduct;
          const {
            createdAt: ca02,
            updatedAt: ua02,
            ...justCreatedGeneratedObject
          } = result.generatedProduct;
          expect(ca01).not.toBeUndefined();
          expect(ca02).not.toBeUndefined();
          expect(ua01).not.toBeUndefined();
          expect(ua02).not.toBeUndefined();
          expect(justCreatedUnitProduct).toMatchSnapshot('Unit Product');
          expect(justCreatedGeneratedObject).toMatchSnapshot(
            'Generated Product',
          );
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
    it.skip('should the createTestAdminRoleContext function run successfully', done => {
      createTestAdminRoleContext(
        1,
        1,
        '!!! REQUIRES EXISTING USER ID !!!',
      ).subscribe({
        complete() {
          done();
        },
      });
    }, 25000);
  });

  describe('AdminUser seeder', () => {
    it.skip('Admin user create', done => {
      seedAdminUser(AWS_CRUD_CONFIG.aws_user_pools_id).subscribe({
        complete() {
          done();
        },
      });
    }, 25000);
  });

  it.skip('should run complete seeder', done => {
    seedAdminUser(AWS_CRUD_CONFIG.aws_user_pools_id)
      .pipe(
        delay(2000),
        switchMap(userId => seedBusinessData(userId)),
        catchError((error: AWSError) => {
          console.error('SEEDING ERROR', JSON.stringify(error, undefined, 2));
          return throwError('SUCCESS');
        }),
      )
      .subscribe({
        complete() {
          done();
        },
      });
  }, 25000);
});
