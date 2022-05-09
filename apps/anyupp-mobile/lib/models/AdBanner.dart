import 'package:flutter/foundation.dart';

@immutable
class AdBanner {
  final String imageUrl;

  AdBanner({
    required this.imageUrl,
  });

  AdBanner copyWith({
    String? imageUrl,
  }) {
    return AdBanner(
      imageUrl: imageUrl ?? this.imageUrl,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'imageUrl': imageUrl,
    };
  }

  factory AdBanner.fromJson(Map<String, dynamic> map) {
    return AdBanner(
      imageUrl: map['imageUrl'] ?? '',
    );
  }

  @override
  String toString() => 'AdBanner(imageUrl: $imageUrl)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is AdBanner && other.imageUrl == imageUrl;
  }

  @override
  int get hashCode => imageUrl.hashCode;
}
