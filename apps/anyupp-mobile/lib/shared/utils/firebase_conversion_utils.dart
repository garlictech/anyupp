int getIntFromFirebaseValue(dynamic value) {
  if (value == null) {
    return 0;
  }

  if (value is int) {
    return value;
  }

  if (value is double) {
    return value.toInt();
  }

  if (value is String) {
    return value.length > 0 ? int.parse(value) : 0;
  }

  return 0;
}

double getDoubleFromFirebaseValue(dynamic value) {
  if (value == null) {
    return 0;
  }

  if (value is double) {
    return value;
  }

  if (value is int) {
    return value.toDouble();
  }

  if (value is String) {
    return value.length > 0 ? double.parse(value) : 0;
  }

  return 0.0;
}
