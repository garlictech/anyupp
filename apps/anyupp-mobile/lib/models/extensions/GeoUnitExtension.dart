import 'package:fa_prev/models.dart';

extension GeoUnitExtension on GeoUnit {
  Location get loc =>
      location ?? address.location ?? Location(lat: 47, lng: 19);
}
