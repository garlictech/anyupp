import 'package:cached_network_image/cached_network_image.dart';
import '/app-config.dart';
import '/core/theme/theme.dart';
import '/shared/widgets/loading_widget.dart';
import 'package:flutter/material.dart';

class S3ImageWidget extends StatefulWidget {
  final String bucketImageKey;
  final double? width;
  final double? height;
  final BoxFit fit;
  final Widget? errorWidget;
  final Widget? placeholder;

  const S3ImageWidget({
    required this.bucketImageKey,
    required this.width,
    required this.height,
    this.fit = BoxFit.cover,
    this.errorWidget,
    this.placeholder,
  });

  @override
  _S3ImageWidgetState createState() => _S3ImageWidgetState();
}

class _S3ImageWidgetState extends State<S3ImageWidget> {
  String? _imageUrl;
  String? _error;

  @override
  void initState() {
    super.initState();
    _getBucketUrlWithKey();
  }

  @override
  Widget build(BuildContext context) {
    return _error == null
        ? (_imageUrl == null
            ? _buildLoadingWidget(context)
            : CachedNetworkImage(
                cacheKey: widget.bucketImageKey,
                imageUrl: _imageUrl!,
                placeholder: widget.placeholder != null
                    ? (context, url) => widget.placeholder!
                    : null,
                errorWidget: widget.errorWidget != null
                    ? (context, url, error) => widget.errorWidget!
                    : null,
                fit: widget.fit,
                width: widget.width,
                height: widget.height,
              ))
        : _buildErrorWidget(context, _error!);
  }

  Widget _buildLoadingWidget(BuildContext context) {
    return Container(
      width: widget.width,
      height: widget.height,
      child: CenterLoadingWidget(
        color: theme.highlight,
      ),
    );
  }

  Widget _buildErrorWidget(BuildContext context, String error) {
    return Container(
      width: widget.width,
      height: widget.height,
      child: Center(
        child: Text(
          error,
          style: Fonts.satoshi(
            color: theme.secondary,
            fontSize: 16.0,
          ),
        ),
      ),
    );
  }

  void _getBucketUrlWithKey() async {
    setState(() {
      _imageUrl =
          'http://${AppConfig.S3BucketName}.s3-${AppConfig.Region}.amazonaws.com/public/${widget.bucketImageKey}';
    });
  }
}
