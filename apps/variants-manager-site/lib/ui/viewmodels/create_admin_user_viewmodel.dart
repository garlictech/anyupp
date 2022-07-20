import 'package:functional_data/functional_data.dart';

part 'create_admin_user_viewmodel.g.dart';

@FunctionalData()
class CreateAdminUserViewModel extends $CreateAdminUserViewModel {
  final bool waiting;
  final String? error;

  CreateAdminUserViewModel({this.waiting = false, this.error = null});
}
