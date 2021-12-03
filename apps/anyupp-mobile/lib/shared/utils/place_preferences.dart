import 'dart:convert';

import 'package:fa_prev/models.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<bool> setPlacePref(String unitId, Place place) async {
  // print('**** setPlacePref[$unitId]=$place');
  SharedPreferences prefs = await SharedPreferences.getInstance();
  return prefs.setString('${unitId}_PLACE', json.encode(place.toJson()));
}

Future<Place?> getPlacePref(String unitId) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? s = prefs.getString('${unitId}_PLACE');
  Place? place = s != null ? Place.fromJson(jsonDecode(s)) : null;
  // print('**** getPlacePref[$unitId]=$place');
  return place;
}

Future<bool> clearPlacePref(String unitId) async {
  // print('**** clearPlacePref[$unitId]');
  SharedPreferences prefs = await SharedPreferences.getInstance();
  return prefs.remove('${unitId}_PLACE');
}
