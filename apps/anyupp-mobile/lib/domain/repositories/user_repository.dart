abstract class UserRepository {
  Future<void> updateFcmToken(String userId, String newToken);
}
