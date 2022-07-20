import '../../entities/entities.dart';

abstract class AdminUserRepository {
  Future<List<AdminUser>> getAdminUserList();
  Future<AdminUser?> getAdminUser(String id);
  Future<bool> deleteAdminUser(String id);
  Future<bool> updateAdminUser(AdminUserUpdate input);
  Future<AdminUser?> createAdminUser(AdminUserCreate input);
}
