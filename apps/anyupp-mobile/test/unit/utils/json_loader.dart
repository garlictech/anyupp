import 'dart:convert';
import 'dart:io';

Future<Map<String, dynamic>> loadJson(String filename) async {
  final file = File(filename);
  return jsonDecode(file.readAsStringSync());
}
