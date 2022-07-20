import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';

class ProductImageWidget extends StatelessWidget {
  final String url;
  final double width;
  final double height;
  final BoxFit fit;
  const ProductImageWidget({
    Key? key,
    required this.url,
    required this.width,
    required this.height,
    this.fit = BoxFit.contain,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ImageWidget(
      url: url,
      width: width,
      height: height,
      fit: fit,
      placeholder: Container(
        // padding: EdgeInsets.all(50.0),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.all(
            Radius.circular(14.0),
          ),
          border: Border.all(
            width: 1.5,
            color: theme.secondary16.withOpacity(0.4),
          ),
        ),
        width: width,
        height: height,
        child: CenterLoadingWidget(
          backgroundColor: theme.secondary12,
        ),
        // child: CircularProgressIndicator(
        //   backgroundColor: theme.secondary12,
        // ),
      ),
      errorWidget: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.all(
            Radius.circular(14.0),
          ),
          border: Border.all(
            width: 1.5,
            color: theme.secondary16.withOpacity(0.4),
          ),
        ),
        child: Center(
          child: Icon(
            Icons.error,
            color: Colors.red,
            size: 32.0,
          ),
        ),
      ),
    );
  }
}
