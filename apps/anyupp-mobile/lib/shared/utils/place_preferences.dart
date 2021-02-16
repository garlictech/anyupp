import 'package:fa_prev/shared/models.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<bool> setPlacePref(Place place) async {
  // print('**** setPlacePref=$place');
  SharedPreferences prefs = await SharedPreferences.getInstance();
  return prefs.setString('PLACE', place.toJson());
}

Future<Place> getPlacePref() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  Place place = Place.fromJson(prefs.getString('PLACE'));
  // print('**** getPlacePref=$place');
  return place;
}

Future<bool> clearPlacePref() async {
  // print('**** clearPlacePref()');
  SharedPreferences prefs = await SharedPreferences.getInstance();
  return prefs.remove('PLACE');
}
