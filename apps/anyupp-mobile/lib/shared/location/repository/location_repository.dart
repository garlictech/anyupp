import 'package:fa_prev/shared/location/location.dart';
import 'package:fa_prev/shared/location/repository/geoip_location_repository.dart';
import 'package:flutter/services.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';

class LocationRepository {
  Future<LatLng> getUserCurrentLocation() async {
    try {
      if (await Permission.location.request().isGranted) {

        bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
        LocationPermission locationPermission = LocationPermission.denied;
        if (!serviceEnabled) {
          locationPermission = await Geolocator.requestPermission();
        }

        print("***** _determineUserPositionAndLoadUnits.start().serviceEnabled=$serviceEnabled");
        print("***** _determineUserPositionAndLoadUnits.start().serviceRequestAccepted=$locationPermission");

        if (locationPermission != null) {

        // if (locationPermission == LocationPermission.always ||
        //     locationPermission == LocationPermission.whileInUse) {
          // print("***** location.getLocation().start()");
          try {
            Position position = await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.best, timeLimit: Duration(seconds: 20));
            // print("***** location.getCurrentPosition().position=$position");
            return LatLng(position.latitude, position.longitude);
          } on Exception {
            // print('***** location.error getting location=$e');
            Position position = await Geolocator.getLastKnownPosition();
            // print("***** location.getLastKnownPosition().position=$position");
            if (position != null) {
              return LatLng(position.latitude, position.longitude);
            } else {
              GeolocationData position = await GeolocationIPLocationRepository.getLocationByIP();
              // print('***** location.getLocationByIP()=$position');
              return (LatLng(position.lat, position.lon));
            }
          }
        } else {
          // print('1. ************* SERVICE REQUEST NOT ACCEPTED!!!!');
          GeolocationData position = await GeolocationIPLocationRepository.getLocationByIP();
          // print('***** location.getLocationByIP()=$position');
          return (LatLng(position.lat, position.lon));
        }
      } else {
        // print("2. *********** _determineUserPositionAndLoadUnits.HANDLE PERMISSION DENIED!");
        GeolocationData position = await GeolocationIPLocationRepository.getLocationByIP();
        // print('***** location.getLocationByIP()=$position');
        return (LatLng(position.lat, position.lon));
      }
    } on Exception catch (e) {
      throw PlatformException(
        code: 'LOCATION_UNKNOWN_ERROR',
        message: e.toString(),
        details: e.runtimeType,
      );
    }
  }
}
