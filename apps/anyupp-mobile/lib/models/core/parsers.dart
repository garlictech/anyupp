String enumToString(Object o) =>
    o != null ? o.toString().split('.').last : null;

// only to be used internally by amplify-flutter library
T enumFromString<T>(String key, List<T> values) =>
    values.firstWhere((v) => key == enumToString(v), orElse: () => null);
