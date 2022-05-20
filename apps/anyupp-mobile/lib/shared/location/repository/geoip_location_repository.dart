import 'dart:convert';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/location/location.dart';
import 'package:http/http.dart' as http;

class GeolocationIPLocationRepository {
  static Future<GeolocationData?> getLocationByIP({String query = ''}) async {
    try {
      final response =
          await http.get(Uri.parse('http://ip-api.com/json/$query'));
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        return GeolocationData.fromJson(json);
      }
      return null;
    } catch (e) {
      log.e(e);
      return null;
    }
  }
}
