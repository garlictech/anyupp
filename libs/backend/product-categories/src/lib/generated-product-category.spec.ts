import { getProductNumberMap } from './generated-product-category';

describe('Product category tests', () => {
  describe('getProductNumberMap function', () => {
    it('should return a map with productId-s as the keys and the numbers as the values', () => {
      const input = [
        { productCategoryId: '1' },
        { productCategoryId: '2' },
        { productCategoryId: '2' },
        { productCategoryId: '3' },
        { productCategoryId: '6' },
        { productCategoryId: '6' },
        { productCategoryId: '6' },
      ];

      const result = getProductNumberMap(input);
      expect(result).toHaveProperty('1', 1);
      expect(result).toHaveProperty('2', 2);
      expect(result).toHaveProperty('3', 1);
      expect(result).toHaveProperty('6', 3);
    });
  });
});
