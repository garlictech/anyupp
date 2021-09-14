class AuthenticatedUser {
  String id;
  String? displayName;
  String? email;
  String? photoUrl;

  AuthenticatedUser({required this.id, this.displayName, this.email, this.photoUrl});
}
