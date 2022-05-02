import 'package:fa_prev/models.dart';

String getFormattedAnonymousEmail(String? email) {
  if (email == null) {
    return '';
  }
  if (email.startsWith('anonymuser')) {
    return 'anonymuser' + email.substring(email.indexOf('@'));
  }
  return email;
}

String getNameLetters(User user) {
  if (user.name != null) {
    return user.name!.split(' ').fold(
          '',
          (prev, element) => prev += element.substring(0, 1).toUpperCase(),
        );
  }
  return 'A';
}
