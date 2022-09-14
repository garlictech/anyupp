import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dartz/dartz.dart';

class LocalStorageHandler {
  Future<Either<dynamic, dynamic>> getItem(String key) async {
    final prefs = await SharedPreferences.getInstance();
    final value = prefs.getString(key);

    return Future.value((value == null
            ? left<dynamic, dynamic>('No value')
            : right<dynamic, dynamic>(value))
        .flatMap((x) => catching<dynamic>(() => json.decode(x))
            .leftMap((x) => 'no value')));
  }

  Future setItem(String key, value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(key, json.encode(value));
  }

  Future removeItem(String key) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(key);
  }

  Future clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}

final localStorageHandlerProvider =
    Provider<LocalStorageHandler>((ref) => LocalStorageHandler());
