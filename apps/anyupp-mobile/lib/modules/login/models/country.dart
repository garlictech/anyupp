import 'package:flutter/foundation.dart';

@immutable
class Country {
  final String name;
  final String flag;
  final String code;
  final String dialCode;

  Country({
    required this.name,
    required this.flag,
    required this.code,
    required this.dialCode,
  });

  Country copyWith({
    String? name,
    String? flag,
    String? code,
    String? dialCode,
  }) {
    return Country(
      name: name ?? this.name,
      flag: flag ?? this.flag,
      code: code ?? this.code,
      dialCode: dialCode ?? this.dialCode,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'flag': flag,
      'code': code,
      'dial_code': dialCode,
    };
  }

  factory Country.fromJson(Map<String, dynamic> map) {
    return Country(
      name: map['name'],
      flag: map['flag'],
      code: map['code'],
      dialCode: map['dial_code'],
    );
  }

  @override
  String toString() {
    return 'Country(name: $name, flag: $flag, code: $code, dialCode: $dialCode)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Country &&
        other.name == name &&
        other.flag == flag &&
        other.code == code &&
        other.dialCode == dialCode;
  }

  @override
  int get hashCode {
    return name.hashCode ^ flag.hashCode ^ code.hashCode ^ dialCode.hashCode;
  }
}
