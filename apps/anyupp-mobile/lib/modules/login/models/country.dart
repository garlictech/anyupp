import 'dart:convert';

class Country {
  String name;
  String flag;
  String code;
  String dialCode;

  Country({
    this.name,
    this.flag,
    this.code,
    this.dialCode,
  });

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'flag': flag,
      'code': code,
      'dial_code': dialCode,
    };
  }

  factory Country.fromMap(Map<String, dynamic> map) {
    if (map == null) return null;
  
    return Country(
      name: map['name'],
      flag: map['flag'],
      code: map['code'],
      dialCode: map['dial_code'],
    );
  }

  String toJson() => json.encode(toMap());

  factory Country.fromJson(String source) => Country.fromMap(json.decode(source));

  @override
  String toString() {
    return 'Country(name: $name, flag: $flag, code: $code, dialCode: $dialCode)';
  }
}
