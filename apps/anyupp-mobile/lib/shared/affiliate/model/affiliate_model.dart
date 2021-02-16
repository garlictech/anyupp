import 'dart:convert';

class Affiliate {
  String title;
  String description;
  String startDate;
  String endDate;
  int intervall;
  List<Advertisement> advertisements;

  Affiliate({
    this.title,
    this.description,
    this.startDate,
    this.endDate,
    this.intervall,
    this.advertisements,
  });

  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'description': description,
      'startDate': startDate,
      'endDate': endDate,
      'intervall': intervall,
      'ads': advertisements?.map((x) => x?.toMap())?.toList(),
    };
  }

  factory Affiliate.fromMap(Map<dynamic, dynamic> map) {
    if (map == null) return null;
  
    return Affiliate(
      title: map['title'],
      description: map['description'],
      startDate: map['startDate'],
      endDate: map['endDate'],
      intervall: map['intervall'],
      advertisements: List<Advertisement>.from(map['ads']?.map((x) => Advertisement.fromMap(x))),
    );
  }

  String toJson() => json.encode(toMap());

  factory Affiliate.fromJson(String source) => Affiliate.fromMap(json.decode(source));

  @override
  String toString() {
    return 'Affiliate(title: $title, description: $description, startDate: $startDate, endDate: $endDate, intervall: $intervall, ads: $advertisements)';
  }
}

class Advertisement {
  AdProduct product;
  AdDisplay display;
  List<AdTag> tags;

  Advertisement({
    this.product,
    this.display,
    this.tags,
  });

  Map<String, dynamic> toMap() {
    return {
      'product': product?.toMap(),
      'display': display?.toMap(),
      'tags': tags?.map((x) => x?.toMap())?.toList(),
    };
  }

  factory Advertisement.fromMap(Map<dynamic, dynamic> map) {
    if (map == null) return null;
  
    return Advertisement(
      product: AdProduct.fromMap(map['product']),
      display: AdDisplay.fromMap(map['display']),
      tags: List<AdTag>.from(map['tags']?.map((x) => AdTag.fromMap(x))),
    );
  }

  String toJson() => json.encode(toMap());

  factory Advertisement.fromJson(String source) => Advertisement.fromMap(json.decode(source));

  @override
  String toString() => 'Advertisement(product: $product, display: $display, tags: $tags)';
}

class AdDisplay {
  String color;
  String backgroundColor;
  int border;
  String borderColor;
  int elevation;
  AdDisplay({
    this.color,
    this.backgroundColor,
    this.border,
    this.borderColor,
    this.elevation,
  });

  Map<String, dynamic> toMap() {
    return {
      'color': color,
      'backgroundColor': backgroundColor,
      'border': border,
      'borderColor': borderColor,
      'elevation': elevation,
    };
  }

  factory AdDisplay.fromMap(Map<dynamic, dynamic> map) {
    if (map == null) return null;
  
    return AdDisplay(
      color: map['color'],
      backgroundColor: map['backgroundColor'],
      border: map['border'],
      borderColor: map['borderColor'],
      elevation: map['elevation'],
    );
  }

  String toJson() => json.encode(toMap());

  factory AdDisplay.fromJson(String source) => AdDisplay.fromMap(json.decode(source));

  @override
  String toString() {
    return 'AdDisplay(color: $color, backgroundColor: $backgroundColor, border: $border, borderColor: $borderColor, elevation: $elevation)';
  }
}

class AdProduct {
  String url;
  String name;
  String description;
  String image;
  String discount;
  int price;
  String currency;
  int discountPrice;
  AdProduct({
    this.url,
    this.name,
    this.description,
    this.image,
    this.discount,
    this.price,
    this.currency,
    this.discountPrice,
  });

  Map<String, dynamic> toMap() {
    return {
      'url': url,
      'name': name,
      'description': description,
      'image': image,
      'discount': discount,
      'price': price,
      'currency': currency,
      'discountPrice': discountPrice,
    };
  }

  factory AdProduct.fromMap(Map<dynamic, dynamic> map) {
    if (map == null) return null;
  
    return AdProduct(
      url: map['url'],
      name: map['name'],
      description: map['description'],
      image: map['image'],
      discount: map['discount'],
      price: map['price'],
      currency: map['currency'],
      discountPrice: map['discountPrice'],
    );
  }

  String toJson() => json.encode(toMap());

  factory AdProduct.fromJson(String source) => AdProduct.fromMap(json.decode(source));

  @override
  String toString() {
    return 'AdProduct(url: $url, name: $name, description: $description, image: $image, discount: $discount, price: $price, currency: $currency, discountPrice: $discountPrice)';
  }
}

class AdTag {
  String id;
  String attribute;
  String type;
  String match;
  int affinity;
  int min;
  int max;
  AdTag({
    this.id,
    this.attribute,
    this.type,
    this.match,
    this.affinity,
    this.min,
    this.max,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'attribute': attribute,
      'type': type,
      'match': match,
      'affinity': affinity,
      'min': min,
      'max': max,
    };
  }

  factory AdTag.fromMap(Map<dynamic, dynamic> map) {
    if (map == null) return null;
  
    return AdTag(
      id: map['id'],
      attribute: map['attribute'],
      type: map['type'],
      match: map['match'],
      affinity: map['affinity'],
      min: map['min'],
      max: map['max'],
    );
  }

  String toJson() => json.encode(toMap());

  factory AdTag.fromJson(String source) => AdTag.fromMap(json.decode(source));

  @override
  String toString() {
    return 'AdTag(id: $id, attribute: $attribute, type: $type, match: $match, affinity: $affinity, min: $min, max: $max)';
  }
}
