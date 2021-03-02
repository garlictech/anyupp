// TODO AWS remove
// import 'dart:convert';

// class UnitStyle {
//   final Colors colors;
//   final Images images;
//   UnitStyle({
//     this.colors,
//     this.images,
//   });

//   UnitStyle copyWith({
//     Colors colors,
//     Images images,
//   }) {
//     return UnitStyle(
//       colors: colors ?? this.colors,
//       images: images ?? this.images,
//     );
//   }

//   // Map<String, dynamic> toMap() {
//   //   return {
//   //     'colors': colors?.toMap(),
//   //     'images': images?.toMap(),
//   //   };
//   // }

//   factory UnitStyle.fromMap(Map<dynamic, dynamic> map) {
//     if (map == null) return null;

//     return UnitStyle(
//       colors: Colors.fromMap(map['colors']),
//       images: Images.fromMap(map['images']),
//     );
//   }

//   // String toJson() => json.encode(toMap());

//   factory UnitStyle.fromJson(String source) => UnitStyle.fromMap(json.decode(source));

//   @override
//   String toString() => 'UnitStyle(colors: $colors, images: $images)';

//   @override
//   bool operator ==(Object o) {
//     if (identical(this, o)) return true;

//     return o is UnitStyle && o.colors == colors && o.images == images;
//   }

//   @override
//   int get hashCode => colors.hashCode ^ images.hashCode;
// }

// class Colors {
//   final String backgroundDark;
//   final String backgroundLight;
//   final String borderDark;
//   final String borderLight;
//   final String disabled;
//   final String highlight;
//   final String indicator;
//   final String textDark;
//   final String textLight;
//   Colors({
//     this.backgroundDark,
//     this.backgroundLight,
//     this.borderDark,
//     this.borderLight,
//     this.disabled,
//     this.highlight,
//     this.indicator,
//     this.textDark,
//     this.textLight,
//   });

//   Colors copyWith({
//     String backgroundDark,
//     String backgroundLight,
//     String borderDark,
//     String borderLight,
//     String disabled,
//     String highlight,
//     String indicator,
//     String textDark,
//     String textLight,
//   }) {
//     return Colors(
//       backgroundDark: backgroundDark ?? this.backgroundDark,
//       backgroundLight: backgroundLight ?? this.backgroundLight,
//       borderDark: borderDark ?? this.borderDark,
//       borderLight: borderLight ?? this.borderLight,
//       disabled: disabled ?? this.disabled,
//       highlight: highlight ?? this.highlight,
//       indicator: indicator ?? this.indicator,
//       textDark: textDark ?? this.textDark,
//       textLight: textLight ?? this.textLight,
//     );
//   }

//   // Map<String, dynamic> toMap() {
//   //   return {
//   //     'backgroundDark': backgroundDark,
//   //     'backgroundLight': backgroundLight,
//   //     'borderDark': borderDark,
//   //     'borderLight': borderLight,
//   //     'disabled': disabled,
//   //     'highlight': highlight,
//   //     'indicator': indicator,
//   //     'textDark': textDark,
//   //     'textLight': textLight,
//   //   };
//   // }

//   factory Colors.fromMap(Map<dynamic, dynamic> map) {
//     if (map == null) return null;

//     return Colors(
//       backgroundDark: map['backgroundDark'],
//       backgroundLight: map['backgroundLight'],
//       borderDark: map['borderDark'],
//       borderLight: map['borderLight'],
//       disabled: map['disabled'],
//       highlight: map['highlight'],
//       indicator: map['indicator'],
//       textDark: map['textDark'],
//       textLight: map['textLight'],
//     );
//   }

//   // String toJson() => json.encode(toMap());

//   factory Colors.fromJson(String source) => Colors.fromMap(json.decode(source));

//   @override
//   String toString() {
//     return 'Colors(backgroundDark: $backgroundDark, backgroundLight: $backgroundLight, borderDark: $borderDark, borderLight: $borderLight, disabled: $disabled, highlight: $highlight, indicator: $indicator, textDark: $textDark, textLight: $textLight)';
//   }

//   @override
//   bool operator ==(Object o) {
//     if (identical(this, o)) return true;

//     return o is Colors &&
//         o.backgroundDark == backgroundDark &&
//         o.backgroundLight == backgroundLight &&
//         o.borderDark == borderDark &&
//         o.borderLight == borderLight &&
//         o.disabled == disabled &&
//         o.highlight == highlight &&
//         o.indicator == indicator &&
//         o.textDark == textDark &&
//         o.textLight == textLight;
//   }

//   @override
//   int get hashCode {
//     return backgroundDark.hashCode ^
//         backgroundLight.hashCode ^
//         borderDark.hashCode ^
//         borderLight.hashCode ^
//         disabled.hashCode ^
//         highlight.hashCode ^
//         indicator.hashCode ^
//         textDark.hashCode ^
//         textLight.hashCode;
//   }
// }

// class Images {
//   final String header;
//   final String logo;
//   Images({
//     this.header,
//     this.logo,
//   });

//   Images copyWith({
//     String header,
//     String logo,
//   }) {
//     return Images(
//       header: header ?? this.header,
//       logo: logo ?? this.logo,
//     );
//   }

//   // Map<String, dynamic> toMap() {
//   //   return {
//   //     'header': header,
//   //     'logo': logo,
//   //   };
//   // }

//   factory Images.fromMap(Map<dynamic, dynamic> map) {
//     if (map == null) return null;

//     return Images(
//       header: map['header'],
//       logo: map['logo'],
//     );
//   }

//   // String toJson() => json.encode(toMap());

//   factory Images.fromJson(String source) => Images.fromMap(json.decode(source));

//   @override
//   String toString() => 'Images(header: $header, logo: $logo)';

//   @override
//   bool operator ==(Object o) {
//     if (identical(this, o)) return true;

//     return o is Images && o.header == header && o.logo == logo;
//   }

//   @override
//   int get hashCode => header.hashCode ^ logo.hashCode;
// }
