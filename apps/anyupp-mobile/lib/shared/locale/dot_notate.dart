dotNotate(Map<String, dynamic> obj, dynamic target, String prefix) {
  obj.forEach((String key, dynamic value) {
    if (value.runtimeType.toString().contains('LinkedHashMap')) {
      dotNotate(value, target, prefix + key + ".");
    } else {
      return target[prefix + key] = value;
    }
  });

  return target;
}
