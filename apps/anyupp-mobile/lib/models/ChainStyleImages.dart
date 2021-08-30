class ChainStyleImages {
  final String? id;
  final String? header;
  final String? logo;
  ChainStyleImages({
    this.id,
    this.header,
    this.logo,
  });

  ChainStyleImages copyWith({
    String? id,
    String? header,
    String? logo,
  }) {
    return ChainStyleImages(
      id: id ?? this.id,
      header: header ?? this.header,
      logo: logo ?? this.logo,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'header': header,
      'logo': logo,
    };
  }

  factory ChainStyleImages.fromJson(Map<String, dynamic> map) {
    return ChainStyleImages(
      id: map['id'],
      header: map['header'],
      logo: map['logo'],
    );
  }

  @override
  String toString() => 'ChainStyleImages(id: $id, header: $header, logo: $logo)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is ChainStyleImages && other.id == id && other.header == header && other.logo == logo;
  }

  @override
  int get hashCode => id.hashCode ^ header.hashCode ^ logo.hashCode;
}
