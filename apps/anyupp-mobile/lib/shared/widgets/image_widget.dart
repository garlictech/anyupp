import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class ImageWidget extends StatelessWidget {
  final String url;
  final double width;
  final double height;
  final BoxFit fit;
  final Widget errorWidget;
  final Widget placeholder;

  const ImageWidget({
    Key key,
    @required this.url,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.errorWidget,
    this.placeholder,
  }) : super(key: key);


  @override
  Widget build(BuildContext context) {

    if (url == null) {
      return Container();
    }

    final bool isSvg = url.toLowerCase().endsWith('.svg');
    return isSvg ? SvgPicture.network(
      url,
      fit: fit,
      width: width,
      height: height,
      placeholderBuilder: placeholder != null ? (context) => placeholder : null,
    ) : CachedNetworkImage(
      imageUrl: url,
      placeholder: placeholder != null ? (context, url) => placeholder : null,
      errorWidget: errorWidget != null ? (context, url, error) => errorWidget : null,
      fit: fit,
      width: width,
      height: height,
    );
  }
}
