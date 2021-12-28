enum LoginMethod { FACEBOOK, GOOGLE, PHONE, APPLE, ANONYMOUS, EMAIL, UNKNOWN }

class LoginMethodUtils {
  static String methodToString(LoginMethod method) {
    switch (method) {
      case LoginMethod.APPLE:
        return 'SignInWithApple';
      case LoginMethod.FACEBOOK:
        return 'Facebook';
      case LoginMethod.GOOGLE:
        return 'Google';
      default:
        return method.toString();
    }
  }

  static LoginMethod stringToMethod(String method) {
    switch (method) {
      case 'apple.com':
        return LoginMethod.APPLE;
      case 'facebook.com':
        return LoginMethod.FACEBOOK;
      case 'google.com':
        return LoginMethod.GOOGLE;
      case 'phone':
        return LoginMethod.PHONE;
      case 'email':
        return LoginMethod.EMAIL;
      default:
        return LoginMethod.UNKNOWN;
    }
  }
}
