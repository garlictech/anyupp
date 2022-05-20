String? enumToString<T>(T o) => o != null ? o.toString().split('.').last : null;

// only to be used internally by amplify-flutter library
// T? enumFromString<T>(String key, List<T> values) =>
//     values.firstWhere((v) => key == enumToString(v), orElse: () => null);
T? enumFromStringNull<T>(String? key, List<T> values, [T? defaultValue]) {
  if (key == null) {
    return defaultValue;
  }
  int index = values.indexWhere(
      (v) => _removeWhiteSpaces(key) == _removeWhiteSpaces(enumToString(v)));
  if (index >= 0) {
    return values[index];
  }

  return defaultValue;
  // T? result = values.firstWhere((v) => key == enumToString(v), orElse: () => null);
}

T enumFromString<T>(String key, List<T> values) {
  // log.d('***** enumFromString($key)=$values');
  int index = values.indexWhere(
      (v) => _removeWhiteSpaces(key) == _removeWhiteSpaces(enumToString(v)));
  return values[index];
}

String? _removeWhiteSpaces(String? s) {
  return s == null ? s : s.replaceAll('_', '').toLowerCase();
}
