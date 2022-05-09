import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';

class AdBannerCardWidget extends StatefulWidget {
  final AdBanner banner;
  final double? height;
  final VoidCallback? onClosed;
  final bool animated;
  const AdBannerCardWidget({
    Key? key,
    required this.banner,
    this.height,
    this.onClosed,
    this.animated = false,
  }) : super(key: key);

  @override
  State<AdBannerCardWidget> createState() => _AdBannerCardWidgetState();
}

class _AdBannerCardWidgetState extends State<AdBannerCardWidget> {
  bool _adBannerHidden = false;

  @override
  Widget build(BuildContext context) {
    return AnimatedSwitcher(
      duration: Duration(milliseconds: widget.animated ? 300 : 0),
      switchOutCurve: Curves.easeOutBack,
      transitionBuilder: (Widget child, Animation<double> animation) {
        return FadeTransition(
          opacity: animation,
          child: SizeTransition(
            sizeFactor: animation,
            axis: Axis.vertical,
            child: child,
          ),
        );
      },
      child: _adBannerHidden
          ? Container(
              key: Key('HIDDEN'),
            )
          : Container(
              key: Key('SHOWN'),
              margin: const EdgeInsets.only(
                top: 8.0,
                bottom: 8.0,
                left: 12.0,
                right: 12.0,
              ),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(
                  14.0,
                ),
                border: Border.all(
                  width: 1,
                  color: theme.secondary0,
                ),
                color: theme.secondary0,
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8.0),
                child: Stack(
                  children: [
                    ImageWidget(
                      url: widget.banner.imageUrl,
                      width: double.infinity,
                      height: widget.height,
                      fit: BoxFit.fitWidth,
                      placeholder: Container(
                        padding: EdgeInsets.all(50.0),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.all(
                            Radius.circular(14.0),
                          ),
                          border: Border.all(
                            width: 1.5,
                            color: theme.secondary16.withOpacity(0.4),
                          ),
                        ),
                        width: 32,
                        height: 32,
                        child: CircularProgressIndicator(
                          backgroundColor: theme.secondary12,
                        ),
                      ),
                      errorWidget: Container(
                        padding: EdgeInsets.all(50.0),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.all(
                            Radius.circular(14.0),
                          ),
                          border: Border.all(
                            width: 1.5,
                            color: theme.secondary16.withOpacity(0.4),
                          ),
                        ),
                        child: Icon(
                          Icons.error,
                          color: Colors.red,
                          size: 32.0,
                        ),
                      ),
                    ),
                    // Close button
                    Positioned(
                      top: 4,
                      right: 4,
                      child: InkWell(
                        onTap: () => setState(() {
                          _adBannerHidden = true;
                          if (widget.animated) {
                            Future.delayed(Duration(milliseconds: 300), () {
                              if (widget.onClosed != null) {
                                widget.onClosed!();
                              }
                            });
                          } else {
                            if (widget.onClosed != null) {
                              widget.onClosed!();
                            }
                          }
                        }), //widget.onClosed,
                        hoverColor: theme.secondary,
                        focusColor: theme.secondary,
                        child: BorderedWidget(
                          width: 32,
                          height: 32,
                          child: Icon(
                            Icons.close,
                            color: theme.secondary,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
