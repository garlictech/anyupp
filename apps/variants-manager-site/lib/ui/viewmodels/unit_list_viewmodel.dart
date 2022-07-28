import 'package:functional_data/functional_data.dart';

part 'unit_list_viewmodel.g.dart';

@FunctionalData()
class UnitListViewModel extends $UnitListViewModel {
  @override
  final bool working;

  UnitListViewModel({this.working = false});
}
