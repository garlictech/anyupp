import '/graphql/generated/crud-api.dart';
import '/models.dart';

extension GeoUnitExtension on GeoUnit {
  Location get loc =>
      location ?? address.location ?? Location(lat: 47, lng: 19);

  bool get canOrder => orderPolicy != OrderPolicy.noOrders;

  bool get hasBanner =>
      coverBannersEnabled == true && coverBanners?.isNotEmpty == true;
}
