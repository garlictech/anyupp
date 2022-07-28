import 'package:functional_data/functional_data.dart';

import '../../domain/entities/entities.dart';
part 'admin_user_list_viewmodel.g.dart';

@FunctionalData()
class AdminUserListViewModel extends $AdminUserListViewModel {
  final bool working;

  AdminUserListViewModel({this.working = false});
}
