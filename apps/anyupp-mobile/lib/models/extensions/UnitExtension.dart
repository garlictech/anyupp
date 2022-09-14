import '../Unit.dart';
import '/graphql/generated/crud-api.dart';

extension UnitExtension on Unit {
  bool get canOrder => orderPolicy != OrderPolicy.noOrders;

  bool get hasBanner => coverBanners?.isNotEmpty == true;
}
