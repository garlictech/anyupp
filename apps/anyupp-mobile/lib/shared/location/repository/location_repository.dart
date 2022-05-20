import 'package:fa_prev/core/core.dart';
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
      log.d(
          "***** LocationRepository.getUserCurrentLocation.start().isLocationEnabled=$isLocationEnabled");
      if (isLocationEnabled) {
        try {
          // Position? lastPosition = await Geolocator.getLastKnownPosition();
          // log.d(
          //     "***** location.getCurrentPosition().lastPosition=$lastPosition");
          // if (_isLastLocationIsValid(lastPosition)) {
          //   return LatLng(lastPosition!.latitude, lastPosition.longitude);
          // }

          Position position = await Geolocator.getCurrentPosition(
              desiredAccuracy: LocationAccuracy.low,
              timeLimit: Duration(seconds: 20));
          // log.d("***** location.getCurrentPosition().position=$position");
          return LatLng(position.latitude, position.longitude);
        } on Exception {
          // log.d('***** location.error getting location=$e');
          Position? position = await Geolocator.getLastKnownPosition();
          // log.d("***** location.getLastKnownPosition().position=$position");
          if (_isLastLocationIsValid(position)) {
            return LatLng(position!.latitude, position.longitude);
          } else {
            GeolocationData? position =
                await GeolocationIPLocationRepository.getLocationByIP();
            // log.d('***** location.getLocationByIP()=$position');
            return (position == null
                ? null
                : LatLng(position.lat, position.lon));
          }
        }
      } else {
        // log.d('1. ************* SERVICE REQUEST NOT ACCEPTED!!!!');
        GeolocationData? position =
            await GeolocationIPLocationRepository.getLocationByIP();
        // log.d('***** location.getLocationByIP()=$position');
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

  bool _isLastLocationIsValid(Position? lastPosition) {
    var diff = lastPosition?.timestamp?.difference(DateTime.now());
    return lastPosition != null && (diff == null || diff.inMinutes >= -10);
  }

  Future<bool> _isLocationAndServiceEnabled() async {
    PermissionStatus permission =
        await LocationPermissions().requestPermissions();
    log.d(
        '**** LocationRepository._isLocationAndServiceEnabled.status=$permission');
    if (permission == PermissionStatus.granted) {
      return true;
    }
    return false;
  }
}
