import { seedAdminUser, seedBusinessData } from '@bgap/anyupp-backend-lib';
import {
  createTestChain,
  createTestChainProduct,
} from '@bgap/anyupp-backend-lib';

describe('Seeder test', () => {
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
    seedBusinessData().subscribe({
      next() {
        done();
      },
    });
  }, 25000);
});
