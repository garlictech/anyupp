import 'dart:convert';
import 'package:convert/convert.dart';
import 'package:crypto/crypto.dart';

///Generate MD5 hash with fixed length
String generateHash(String s, [int length = 6]) {
  var content = Utf8Encoder().convert(s);
  var digest = md5.convert(content);
  return hex.encode(digest.bytes).substring(0, length).toUpperCase();
}
