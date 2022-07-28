import 'package:functional_data/functional_data.dart';
part 'login-screen-viewmodel.g.dart';

@FunctionalData()
class LoginScreenViewModel extends $LoginScreenViewModel {
  final bool loggingIn;
  final bool passwordVisibility;

  LoginScreenViewModel(
      {this.loggingIn = false, this.passwordVisibility = false});
}
