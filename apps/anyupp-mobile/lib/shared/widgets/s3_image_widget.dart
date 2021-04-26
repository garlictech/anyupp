
import 'package:cached_network_image/cached_network_image.dart';
import 'package:fa_prev/app-config.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/widgets/loading_widget.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class S3ImageWidget extends StatefulWidget {
  final String bucketImageKey;
  final double width;
  final double height;
  final BoxFit fit;
  final Widget errorWidget;
  final Widget placeholder;

  const S3ImageWidget({
    Key key,
    @required this.bucketImageKey,
    this.width,
    this.height,
    this.fit,
    this.errorWidget,
    this.placeholder,
  }) : super(key: key);

  @override
  _S3ImageWidgetState createState() => _S3ImageWidgetState();
}

class _S3ImageWidgetState extends State<S3ImageWidget> {
  String _imageUrl;
  String _error;

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
                imageUrl: _imageUrl,
                placeholder: widget.placeholder != null ? (context, url) => widget.placeholder : null,
                errorWidget: widget.errorWidget != null ? (context, url, error) => widget.errorWidget : null,
                fit: widget.fit,
                width: widget.width,
                height: widget.height,
              ))
        : _buildErrorWidget(context);
  }

  Widget _buildLoadingWidget(BuildContext context) {
    return Container(
      width: widget.width,
      height: widget.height,
      child: CenterLoadingWidget(),
    );
  }

  Widget _buildErrorWidget(BuildContext context) {
    return Container(
      width: widget.width,
      height: widget.height,
      child: Center(
        child: Text(
          _error,
          style: GoogleFonts.poppins(
            color: theme.text,
            fontSize: 16.0,
          ),
        ),
      ),
    );
  }

  void _getBucketUrlWithKey() async {
    print('_getBucketUrlWithKey.key=${widget.bucketImageKey}');
    String url =
        'https://${AppConfig.S3BucketName}.s3-${AppConfig.Region}.amazonaws.com/${widget.bucketImageKey}';
    print('_getBucketUrlWithKey.url=$url');
    setState(() {
      _imageUrl = url; //.split('?')[0];
    });

    // try {
    //   print('_getBucketUrlWithKey.key=${widget.bucketImageKey}');
    //   String imagePath = (await getTemporaryDirectory()).path;
    //   File imageFile = File('$imagePath/${widget.bucketImageKey}');
    //   print('_getBucketUrlWithKey.path=$imageFile');
    //   print('_getBucketUrlWithKey.exists=${await imageFile.exists()}');

    //   S3GetUrlOptions options = S3GetUrlOptions(accessLevel: StorageAccessLevel.guest, expires: 10000);
    //   GetUrlResult result = await Amplify.Storage.getUrl(key: widget.bucketImageKey, options: options);
    //   print('_getBucketUrlWithKey.url=${result.url}');

    //   // DownloadFileOptions dOptions = DownloadFileOptions(
    //   //   accessLevel: StorageAccessLevel.guest,
    //   // );
    //   // DownloadFileResult downloadResult = await Amplify.Storage.downloadFile(
    //   //   key: widget.bucketImageKey,
    //   //   local: imageFile,
    //   //   options: dOptions,
    //   // );
    //   // print('_getBucketUrlWithKey.downloadResult=$downloadResult');

    //   setState(() {
    //     _imageUrl = result.url; //.split('?')[0];
    //   });
    // } catch (e) {
    //   print('_getBucketUrlWithKey.error: $e');
    //   setState(() {
    //     _error = e.toString();
    //   });
    // }
  }
}
