import { seededIdPrefix } from '@bgap/shared/fixtures';
import { Role } from '@bgap/domain';

const generateChainId = (idx: number) => `${seededIdPrefix}chain_${idx}_id`;
const generateGroupId = (chainIdx: number, idx: number) =>
  `${seededIdPrefix}group_c${chainIdx}_${idx}_id`;
const generateUnitId = (chainIdx: number, groupIdx: number, idx: number) =>
  `${seededIdPrefix}unit_c${chainIdx}_g${groupIdx}_${idx}_id`;
const generateProductCategoryId = (chainIdx: number, idx: number) =>
  `${seededIdPrefix}product_category_c${chainIdx}_${idx}_id`;
const generateChainProductId = (chainIdx: number, idx: number) =>
  `${seededIdPrefix}chain_product_c${chainIdx}_${idx}_id`;
const generateGroupProductId = (
  chainIdx: number,
  groupIdx: number,
  idx: number,
) => `${seededIdPrefix}group_product_c${chainIdx}_g${groupIdx}_${idx}_id`;
const generateUnitProductId = (
  chainIdx: number,
  groupIdx: number,
  idx: number,
) => `${seededIdPrefix}unit_product_c${chainIdx}_g${groupIdx}_${idx}_id`;
const generateVariantId = (
  chainIdx: number,
  productId: number,
  idx: number,
  type: string,
) =>
  `${seededIdPrefix}${type}_product_variant_c${chainIdx}_p${productId}_${idx}_id`;
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
  generateChainId,
  generateGroupId,
  generateUnitId,
  generateProductCategoryId,
  generateChainProductId,
  generateGroupProductId,
  generateUnitProductId,
  generateVariantId,
  generateOrderId,
  generateUserId,
  generateRoleContextId,
  generateAdminRoleContextId,
};
