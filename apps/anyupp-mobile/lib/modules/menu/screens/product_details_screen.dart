import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/menu/bloc/configset_bloc.dart';
import 'package:fa_prev/modules/menu/bloc/configset_state.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:odometer/odometer.dart';

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
    // List<Widget> allergenGrids = [];
    // List<String> allergens = widget.item.allergens;
    // if (allergens != null) {
    //   for (String allergen in allergens) {
    //     allergenGrids.add(Padding(
    //       padding: const EdgeInsets.all(4.0),
    //       child: Container(
    //         height: 50,
    //         width: 50,
    //         child: allergenGridWidget(
    //             allergen: trans("allergens.$allergen"),
    //             index: GeneratedProduct.allergenMap[allergen],
    //             assetPath: "assets/allergens/$allergen.svg"),
    //       ),
    //     ));
    //   }
    // }
    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
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
                      //bottom: 16.0,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          getLocalizedText(context, widget.item.name).toUpperCase(),
                          textAlign: TextAlign.left,
                          style: GoogleFonts.poppins(
                            fontSize: 22.0,
                            fontWeight: FontWeight.bold,
                            color: theme.text,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                StreamBuilder<Cart>(
                  stream: getIt<CartRepository>().getCurrentCartStream(unit.id),
                  builder: (context, AsyncSnapshot<Cart> snapshot) {
                    if (snapshot.connectionState != ConnectionState.waiting || snapshot.hasData) {
                      //return _buildVariantsList(snapshot.data, widget.item.variants);
                      return ProductDetailVariantListWidget(
                        cart: snapshot.data,
                        product: widget.item,
                        unit: unit,
                      );
                    }

                    return CenterLoadingWidget();
                  },
                ),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Padding(
                    padding: const EdgeInsets.only(left: 30.0, top: 16.0),
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
          ),
        ),
        (widget.item.configSets == null || widget.item.configSets.isEmpty)
            ? Container()
            : _buildTotalButtonWidget(context)
      ],
    );
  }

  Widget _buildTotalButtonWidget(BuildContext context) {
    return BlocBuilder<ConfigsetBloc, ConfigsetState>(
      builder: (context, state) {
        if (state is ConfigsetUpdated) {
          return Container(
              padding: EdgeInsets.all(8.0),
              height: 76.0,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  primary: theme.indicator,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      trans("cart.addToCart"), // + formatCurrencyWithSignal(_modifierTotalPrice, widget.unit.currency),
                      style: GoogleFonts.poppins(
                        fontSize: 24.0,
                        color: theme.text2,
                      ),
                    ),
                    Text(
                      " (", // + formatCurrencyWithSignal(_modifierTotalPrice, widget.unit.currency),
                      style: GoogleFonts.poppins(
                        fontSize: 24.0,
                        color: theme.text2,
                      ),
                    ),
                    AnimatedSlideOdometerNumber(
                      letterWidth: 14.0,
                      numberTextStyle: GoogleFonts.poppins(
                        fontSize: 24.0,
                        color: theme.text2,
                      ),
                      odometerNumber: OdometerNumber(state.totalPrice.toInt()),
                      duration: Duration(milliseconds: 300),
                    ),
                    Text(
                      getNumberFormatter(widget.unit.currency).currencySymbol + ")" ??
                          'ft' + ")", // + formatCurrencyWithSignal(_modifierTotalPrice, widget.unit.currency),
                      style: GoogleFonts.poppins(
                        fontSize: 24.0,
                        color: theme.text2,
                      ),
                    ),
                  ],
                ),
                onPressed: () async {
                  BlocProvider.of<CartBloc>(context).add(AddProductToCartAction(state.unit, state.orderItem));
                },
              ));
        } else {
          return Container();
        }
      },
    );
  }
}
