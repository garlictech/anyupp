import 'dart:convert';

import 'package:fa_prev/models.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<bool> setPlacePref(Place place) async {
  // print('**** setPlacePref=$place');
  SharedPreferences prefs = await SharedPreferences.getInstance();
  return prefs.setString('PLACE', place.toString());
}

Future<Place> getPlacePref() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String s = prefs.getString('PLACE');
  Place place = s != null ? Place.fromJson(jsonDecode(s)) : null;
  // print('**** getPlacePref=$place');
  return place;
}

Future<bool> clearPlacePref() async {
  // print('**** clearPlacePref()');
  SharedPreferences prefs = await SharedPreferences.getInstance();
  return prefs.remove('PLACE');
}
