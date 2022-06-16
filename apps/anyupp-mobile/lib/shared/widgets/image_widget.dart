import 'package:cached_network_image/cached_network_image.dart';
import 'package:fa_prev/shared/widgets/s3_image_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class ImageWidget extends StatelessWidget {
  final String? url;
  final double? width;
  final double? height;
  final BoxFit fit;
  final Widget? errorWidget;
  final Widget? placeholder;

  const ImageWidget({
    this.url,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.errorWidget,
    this.placeholder,
  });

  @override
  Widget build(BuildContext context) {
    if (url == null) {
      return Container();
    }

    final bool isS3Image = !url!.startsWith('http');
    final bool isAssets = url!.startsWith('assets');

    final bool isSvg = url!.toLowerCase().endsWith('.svg');
    return isAssets
        ? isSvg
            ? SvgPicture.asset(
                url!,
                width: width,
                height: height,
                fit: fit,
              )
            : Image.asset(
                url!,
                width: width,
                height: height,
                fit: fit,
              )
        : isS3Image
            ? S3ImageWidget(
                bucketImageKey: url!,
                fit: fit,
                width: width,
                height: height,
                placeholder: placeholder,
                errorWidget: errorWidget,
              )
            : isSvg
                ? SvgPicture.network(
                    url!,
                    fit: fit,
                    width: width,
                    height: height,
                    placeholderBuilder:
                        placeholder != null ? (context) => placeholder! : null,
                  )
                : CachedNetworkImage(
                    imageUrl: url!,
                    placeholder: placeholder != null
                        ? (context, url) => placeholder!
                        : null,
                    errorWidget: errorWidget != null
                        ? (context, url, error) => errorWidget!
                        : null,
                    fit: fit,
                    width: width,
                    height: height,
                  );
  }
}
