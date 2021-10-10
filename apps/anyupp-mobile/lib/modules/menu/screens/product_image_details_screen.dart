import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models/GeneratedProduct.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';

class ProductImageDetailsScreen extends StatelessWidget {
  final GeneratedProduct product;

  const ProductImageDetailsScreen({Key? key, required this.product}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        // backgroundColor: Colors.transparent,
        extendBodyBehindAppBar: false,
        appBar: AppBar(
          leading: Padding(
            padding: const EdgeInsets.only(
              top: 8.0,
              bottom: 8.0,
              left: 15.0,
            ),
            child: BackButtonWidget(
              color: theme.secondary,
            ),
          ),
          elevation: 0.0,
          iconTheme: IconThemeData(
            color: theme.secondary, //change your color here
          ),
          backgroundColor: Colors.transparent,
        ),
        body: Container(
          color: Colors.transparent,
          padding: EdgeInsets.only(
            top: 24.0,
          ),
          child: Container(
            // height: double.infinity,
            // color: theme.secondary0,
            padding: EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.all(
                Radius.circular(14.0),
              ),
              border: Border.all(
                width: 1.5,
                color: theme.secondary16.withOpacity(0.4),
              ),
            ),
            child: Stack(
              fit: StackFit.expand,
              children: [
                Align(
                  alignment: Alignment.topCenter,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(
                      8.0,
                    ),
                    child: ImageWidget(
                      url: product.image,
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
                        // width: widthContainer,
                        // height: heightContainer,
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
                      fit: BoxFit.contain,
                    ),
                  ),
                ),
                Align(
                  alignment: Alignment.bottomCenter,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        getLocalizedText(context, product.name),
                        style: Fonts.satoshi(
                          color: theme.secondary,
                          fontSize: 18.0,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        product.description == null ? '' : getLocalizedText(context, product.description!),
                        style: Fonts.satoshi(
                          color: theme.secondary,
                          fontSize: 14.0,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                    ],
                  ),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
