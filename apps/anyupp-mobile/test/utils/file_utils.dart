import 'dart:convert';
import 'dart:io';

Map<String, dynamic> loadDataJson(String fileName) {
  String json = File(fileName).readAsStringSync();
  return jsonDecode(json);
}
