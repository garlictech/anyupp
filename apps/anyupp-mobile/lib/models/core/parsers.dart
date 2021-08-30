String? enumToString<T>(T o) => o != null ? o.toString().split('.').last : null;

// only to be used internally by amplify-flutter library
// T? enumFromString<T>(String key, List<T> values) =>
//     values.firstWhere((v) => key == enumToString(v), orElse: () => null);
T? enumFromStringNull<T>(String key, List<T> values) {
  int index = values.indexWhere((v) => key == enumToString(v));
  if (index >= 0) {
    return values[index];
  }

  return null;
  // T? result = values.firstWhere((v) => key == enumToString(v), orElse: () => null);
}

T enumFromString<T>(String key, List<T> values) {
  // print('***** enumFromString($key)=$values');
  int index = values.indexWhere((v) => key == enumToString(v));
  return values[index];
}
