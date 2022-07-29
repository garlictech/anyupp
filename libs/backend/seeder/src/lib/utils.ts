import { seededIdPrefix } from '@bgap/shared/fixtures';
import { Role } from '@bgap/domain';

const generateUnitId = (idx: number) => `${seededIdPrefix}unit_${idx}_id`;
const generateProductCategoryId = (unitIdx: number, idx: number) =>
  `${seededIdPrefix}product_category_c${unitIdx}_${idx}_id`;
const generateUnitProductId = (unitIdx: number, idx: number) =>
  `${seededIdPrefix}unit_product_c${unitIdx}_${idx}_id`;
const generateVariantId = (
  unitIdx: number,
  productId: number,
  idx: number,
  type: string,
) =>
  `${seededIdPrefix}${type}_product_variant_c${unitIdx}_p${productId}_${idx}_id`;
const generateOrderId = (idx: number) => `${seededIdPrefix}order_${idx}_id`;
const generateUserId = (idx: number) => `${seededIdPrefix}user_${idx}_id`;
const generateRoleContextId = (idx: number, role: Role) =>
  `${seededIdPrefix}role_context_${idx}_${role}_id`;
const generateAdminRoleContextId = (
  idx: number,
  role: Role,
  username: string,
) => `${seededIdPrefix}admin_role_context_${idx}_${role}_${username}_id`;

export const seedUtils = {
  generateUnitId,
  generateProductCategoryId,
  generateUnitProductId,
  generateVariantId,
  generateOrderId,
  generateUserId,
  generateRoleContextId,
  generateAdminRoleContextId,
};
