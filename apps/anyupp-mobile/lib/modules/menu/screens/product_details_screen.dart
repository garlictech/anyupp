import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/bloc/cart_event.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fa_prev/shared/nav.dart';

class ProductDetailsScreen extends StatefulWidget {
  final GeoUnit unit;
  final String heroId;
  final GeneratedProduct item;
  ProductDetailsScreen({Key key, @required this.item, @required this.heroId, @required this.unit}) : super(key: key);

  @override
  _ProductDetailsScreenState createState() => _ProductDetailsScreenState();
}

class _ProductDetailsScreenState extends State<ProductDetailsScreen> {
  bool isFavorite = false;

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: theme.background,
      statusBarIconBrightness: Brightness.dark,
    ));

    return NetworkConnectionWrapperWidget(
      child: BlocBuilder<UnitSelectBloc, UnitSelectState>(builder: (context, state) {
        if (state is UnitSelected) {
          return _buildMain(context, state.unit);
        }

        return CenterLoadingWidget();
      }),
    );
  }

  Widget _buildMain(BuildContext context, GeoUnit unit) {
    return SafeArea(
      child: Scaffold(
        backgroundColor: theme.background,
        appBar: AppBar(
            leading: Container(
              padding: EdgeInsets.only(
                left: 8.0,
                top: 4.0,
                bottom: 4.0,
              ),
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    width: 1,
                    color: theme.border2,
                  ),
                ),
                child: BackButton(
                  onPressed: () => Nav.pop(),
                  color: theme.text,
                ),
              ),
            ),
            elevation: 0.0,
            iconTheme: IconThemeData(
              color: theme.text, //change your color here
            ),
            backgroundColor: theme.background,
            title: Text(
              getLocalizedText(context, widget.item.name),
            ),
            actions: <Widget>[
              Container(
                padding: EdgeInsets.only(
                  top: 4.0,
                  bottom: 4.0,
                ),
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      width: 1,
                      color: theme.border2,
                    ),
                  ),
                  child: CartIconWidget(
                    color: theme.text,
                    badgeColor: theme.indicator,
                    badgeStyle: GoogleFonts.poppins(
                      fontSize: 12.0,
                      color: theme.text2,
                    ),
                    onTapped: () {
                      Nav.reset(MainNavigation(
                                pageIndex: 4,
                                animateCartIcon: false,
                              ));
                    },
                  ),
                ),
              ),
              SizedBox(
                width: 6.0,
              ),
              Container(
                padding: EdgeInsets.only(
                  top: 4.0,
                  bottom: 4.0,
                ),
                child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        width: 1,
                        color: theme.border2,
                      ),
                    ),
                    child: FavoriteIconWidget(
                      theme: theme,
                      product: widget.item,
                      unit: unit,
                    )),
              ),
              SizedBox(
                width: 15.0,
              ),
            ]),
        body: buildDetailsScreen(context, unit),
      ),
    );
  }

  Widget buildDetailsScreen(BuildContext context, GeoUnit unit) {
    return SingleChildScrollView(
      physics: BouncingScrollPhysics(),
      child: Column(
        children: <Widget>[
          Hero(
            tag: widget.heroId,
            child: ImageWidget(
              url: widget.item.image,
              placeholder: CircularProgressIndicator(
                backgroundColor: Colors.black,
              ),
              errorWidget: Icon(
                Icons.error,
                color: Colors.red,
              ),
              fit: BoxFit.contain,
              width: 200.0,
            ),
          ),
          Align(
            alignment: Alignment.centerLeft,
            child: Padding(
              padding: const EdgeInsets.only(
                left: 30.0,
                bottom: 25.0,
              ),
              child: Text(
                getLocalizedText(context, widget.item.name).toUpperCase(),
                textAlign: TextAlign.left,
                style: GoogleFonts.poppins(
                  fontSize: 22.0,
                  fontWeight: FontWeight.bold,
                  color: theme.text,
                ),
              ),
            ),
          ),
          StreamBuilder<Cart>(
            stream: getIt<CartRepository>().getCurrentCartStream(unit.chainId, unit.id),
            builder: (context, AsyncSnapshot<Cart> snapshot) {
              if (snapshot.connectionState != ConnectionState.waiting || snapshot.hasData) {
                return _buildVariantsList(snapshot.data, widget.item.variants);
              }

              return CenterLoadingWidget();
            },
          ),
          Align(
            alignment: Alignment.centerLeft,
            child: Padding(
              padding: const EdgeInsets.only(left: 30.0, top: 40.0),
              child: Text(
                getLocalizedText(context, widget.item.description),
                textAlign: TextAlign.left,
                style: GoogleFonts.poppins(
                  color: theme.text,
                  fontWeight: FontWeight.normal,
                  fontSize: 13,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVariantsList(Cart cart, List<ProductVariant> list) {
    // print('***** _buildVariantsList.cart=$cart, variants=$list');
    if (list == null) {
      return Container();
    }
    List<Widget> items = [];
    list.forEach((variant) {
      items.add(_buildVariantItem(context, cart, variant, widget.unit));
    });
    return Column(
      children: items,
    );
  }

  Widget _buildVariantItem(BuildContext context, Cart cart, ProductVariant variant, GeoUnit unit) {
    final int variantCountInCart = cart == null ? 0 : cart.variantCount(widget.item, variant);

    return Container(
      height: 76,
      margin: EdgeInsets.only(left: 14, top: 10, right: 14),
      decoration: BoxDecoration(
        color: theme.background2,
        boxShadow: [
          BoxShadow(
            color: Color.fromARGB(5, 0, 0, 0),
            offset: Offset(0, 0),
            blurRadius: 20,
          ),
        ],
        borderRadius: BorderRadius.all(
          Radius.circular(12),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
//            flex: 65,
            child: Container(
              margin: EdgeInsets.only(left: 22, top: 5, bottom: 5, right: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    getLocalizedText(context, variant.variantName),
                    textAlign: TextAlign.left,
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                    style: GoogleFonts.poppins(
                      color: theme.text,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  if (variant.pack.size > 0.0)
                    Container(
                      margin: EdgeInsets.only(top: 4),
                      child: Text(
                        '${variant.pack.size} ${variant.pack.unit}',
                        textAlign: TextAlign.left,
                        style: GoogleFonts.poppins(
                          color: theme.highlight,
                          fontWeight: FontWeight.w500,
                          fontSize: 12,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
          Align(
            alignment: Alignment.centerRight,
            // flex: 35,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Container(
                  margin: EdgeInsets.only(right: 8.0),
                  child: Text(
                    formatCurrency(variant.price, unit.currency ?? 'huf'), // TODO geounit!!
                    textAlign: TextAlign.right,
                    style: GoogleFonts.poppins(
                      color: theme.highlight,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                Container(
                  width: 46,
                  height: 46,
                  margin: EdgeInsets.only(right: 15),
                  child: FlatButton(
                    padding: EdgeInsets.all(0),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10.0),
                    ),
                    onPressed: () {
                      _addOrder(variant);
                    },
                    color: theme.indicator,
                    textColor: theme.text2,
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 300),
                      transitionBuilder: (Widget child, Animation<double> animation) {
                        return ScaleTransition(
                          child: child,
                          scale: animation,
                        );
                      },
                      child: Text(
                        variantCountInCart == 0 ? '+' : 'x$variantCountInCart',
                        key: ValueKey<String>('${variant.id}-$variantCountInCart'),
                        softWrap: false,
                        textAlign: TextAlign.center,
                        style: GoogleFonts.poppins(
                          color: theme.text2,
                          fontSize: variantCountInCart == 0 ? 32.0 : 24.0,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _addOrder(ProductVariant variant) {
    BlocProvider.of<CartBloc>(context).add(AddProductToCartAction(
      widget.unit,
      widget.item,
      variant,
    ));
  }
}
