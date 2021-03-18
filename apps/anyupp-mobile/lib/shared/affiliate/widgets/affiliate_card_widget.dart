import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:fa_prev/shared/locale.dart';

import 'package:fa_prev/shared/affiliate.dart';

class AffiliateCardWidget extends StatelessWidget {
  final double height;

  const AffiliateCardWidget({Key key, this.height = 110.0}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: this.height,
      child: Card(
        elevation: 5.0,
        color: theme.background,
        child: BlocBuilder<AffiliateBloc, AffiliateState>(builder: (context, AffiliateState state) {
          if (state is ShowAdvertisementState) {
            return AnimatedSwitcher(
              duration: const Duration(milliseconds: 2000),
              transitionBuilder: (Widget child, Animation<double> animation) {
                return FadeTransition(
                  child: child,
                  opacity: animation,
                  // scale: animation,
                );
              },
              child: _buildCardContent(context, state.product, state.display),
            );
          }
          return CenterLoadingWidget();
        }),
      ),
    );
  }

  Widget _buildCardContent(BuildContext context, AdProduct product, AdDisplay display) {
    if (product.discount != null) {
      return ClipRect(
        key: ValueKey<String>('${product.name}'),
        child: Banner(
          message: product.discount,
          location: BannerLocation.topEnd,
          color: theme.highlight,
          textStyle: GoogleFonts.poppins(
            color: Colors.white,
            fontSize: 13.0,
          ),
          child: _buildProductInfo(context, product, display),
        ),
      );
    }

    return Container(
      key: ValueKey<String>('${product.name}'),
      child: _buildProductInfo(context, product, display),
    );
  }

  Widget _buildProductInfo(BuildContext context, AdProduct product, AdDisplay display) {
    return Stack(children: <Widget>[
      Align(
        alignment: Alignment.topLeft,
        child: Container(
          padding: EdgeInsets.all(5.0),
          child: InkWell(
            onTap: () => launch(product.url),
            highlightColor: theme.indicator.withAlpha(128),
            hoverColor: theme.indicator.withAlpha(128),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: <Widget>[
                Container(
                  padding: EdgeInsets.only(top: 10.0),
                  child: ImageWidget(
                    width: 90,
                    url: product.image,
                    errorWidget: Icon(Icons.error),
                    fit: BoxFit.contain,
                  ),
                ),
                Expanded(
                  child: Container(
                    padding: EdgeInsets.only(
                      left: 16.0,
                      right: 16.0,
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          //'iPhone 12 Mini 64GB fekete',
                          product.name,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          softWrap: false,
                          style: GoogleFonts.poppins(
                            fontSize: 15.0,
                            color: theme.text,
                          ),
                        ),
                        Text(
                          //'Mobiltelefon, 5,4-es kijelző, 2340 × 1080, OLED kijelző, 6 magos Apple A14 Bionic processzor, 64 GB belső tárhely',
                          product.description,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          softWrap: false,
                          textAlign: TextAlign.justify,
                          style: GoogleFonts.poppins(
                            fontSize: 11.0,
                            color: theme.text,
                          ),
                        ),
                        Spacer(),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: [
                            Text(
                              '${product.price} ${product.currency}',
                              style: GoogleFonts.poppins(
                                fontSize: 14.0,
                                color: theme.text,
                                decoration: product.discountPrice != null ? TextDecoration.lineThrough : null,
                              ),
                            ),
                            // SizedBox(width: 16.0),
                            Spacer(),
                            if (product.discountPrice != null)
                              Text(
                                '${product.discountPrice} ${product.currency}',
                                style: GoogleFonts.poppins(
                                  fontSize: 14.0,
                                  color: theme.text,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                          ],
                        )
                      ],
                    ),
                  ),
                )
              ],
            ),
          ),
        ),
      ),
      Align(
          alignment: Alignment.topLeft,
          child: Container(
              padding: EdgeInsets.only(left: 2.0),
              child: Text(trans(context, 'affiliate.advertisement'),
                  style: GoogleFonts.poppins(
                    fontSize: 12.0,
                    color: theme.text.withAlpha(128),
                  )))),
    ]);
  }
}
