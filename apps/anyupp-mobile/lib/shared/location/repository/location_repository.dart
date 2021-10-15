import 'package:fa_prev/shared/location/location.dart';
import 'package:fa_prev/shared/location/repository/geoip_location_repository.dart';
import 'package:flutter/services.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import 'package:location_permissions/location_permissions.dart';

class LocationRepository {
  Future<LatLng?> getUserCurrentLocation() async {
    try {
      bool isLocationEnabled = await _isLocationAndServiceEnabled();
      print("***** LocationRepository.getUserCurrentLocation.start().isLocationEnabled=$isLocationEnabled");
      if (isLocationEnabled) {
        try {
          // Position? lastPosition = await Geolocator.getLastKnownPosition();
          // if (lastPosition != null) {
          //   return LatLng(lastPosition.latitude, lastPosition.longitude);
          // }

          Position position = await Geolocator.getCurrentPosition(
              desiredAccuracy: LocationAccuracy.best, timeLimit: Duration(seconds: 20));
          // print("***** location.getCurrentPosition().position=$position");
          return LatLng(position.latitude, position.longitude);
        } on Exception {
          // print('***** location.error getting location=$e');
          Position? position = await Geolocator.getLastKnownPosition();
          // print("***** location.getLastKnownPosition().position=$position");
          if (position != null) {
            return LatLng(position.latitude, position.longitude);
          } else {
            GeolocationData? position = await GeolocationIPLocationRepository.getLocationByIP();
            // print('***** location.getLocationByIP()=$position');
            return (position == null ? null : LatLng(position.lat, position.lon));
          }
        }
      } else {
        // print('1. ************* SERVICE REQUEST NOT ACCEPTED!!!!');
        GeolocationData? position = await GeolocationIPLocationRepository.getLocationByIP();
        // print('***** location.getLocationByIP()=$position');
        return (position == null ? null : LatLng(position.lat, position.lon));
      }
    } on Exception catch (e) {
      throw PlatformException(
        code: 'LOCATION_UNKNOWN_ERROR',
        message: e.toString(),
        details: e.runtimeType,
      );
    }
  }

  Future<bool> _isLocationAndServiceEnabled() async {
    PermissionStatus permission = await LocationPermissions().requestPermissions();
    print('**** LocationRepository._isLocationAndServiceEnabled.status=$permission');
    if (permission == PermissionStatus.granted) {
      return true;
    }
    return false;
  }
}
