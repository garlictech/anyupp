import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:fa_prev/modules/main/main.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ProductDetailsScreen extends StatelessWidget {
  final GeoUnit unit;
  final GeneratedProduct item;
  ProductDetailsScreen({Key? key, required this.item, required this.unit})
      : super(key: key);

  final GlobalKey<ScaffoldState> _key = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    // SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
    //   statusBarColor: theme.secondary0,
    //   statusBarIconBrightness: Brightness.dark,
    // ));

    return NetworkConnectionWrapperWidget(
      child: BlocBuilder<UnitSelectBloc, UnitSelectState>(
          builder: (context, state) {
        if (state is UnitSelected) {
          return SafeArea(
            child: Scaffold(
              key: _key,
              // backgroundColor: theme.secondary12,
              extendBodyBehindAppBar: true,
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
                  actions: <Widget>[
                    Padding(
                      padding: const EdgeInsets.only(
                        top: 8.0,
                        bottom: 8.0,
                        right: 15.0,
                      ),
                      child: BorderedWidget(
                        width: 40,
                        child: FavoriteIconWidget(
                          theme: theme,
                          product: item,
                          unit: unit,
                          iconSize: 24,
                        ),
                      ),
                    ),
                  ]),
              body: ProductDetailsWidget(
                item: item,
                unit: unit,
              ),
            ),
          );
        }

        return CenterLoadingWidget();
      }),
    );
  }
}

class ProductDetailsWidget extends StatelessWidget {
  final GeoUnit unit;
  final GeneratedProduct item;
  const ProductDetailsWidget({Key? key, required this.unit, required this.item})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: theme.secondary12,
      // margin: EdgeInsets.only(top: 16.0),
      child: Column(
        children: [
          Expanded(
            child: RawScrollbar(
              // controller: _controller,
              thumbColor: theme.secondary.withOpacity(0.2),
              radius: Radius.circular(20),
              isAlwaysShown: true,
              thickness: 4,
              child: SingleChildScrollView(
                physics: BouncingScrollPhysics(),
                child: Container(
                  color: theme.secondary0,
                  padding: EdgeInsets.only(top: 16.0),
                  child: Column(
                    children: <Widget>[
                      Container(
                        color: theme.secondary0,
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(
                                8.0,
                              ),
                              child: InkWell(
                                onTap: () => Nav.to(
                                  ProductImageDetailsScreen(
                                    product: item,
                                  ),
                                  animationType: NavAnim.SLIDEIN_DOWN,
                                  duration: Duration(milliseconds: 200),
                                ),
                                child: ImageWidget(
                                  url: item.image,
                                  width:
                                      MediaQuery.of(context).size.width / 2.5,
                                  placeholder: Container(
                                    padding: EdgeInsets.all(50.0),
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.all(
                                        Radius.circular(14.0),
                                      ),
                                      border: Border.all(
                                        width: 1.5,
                                        color:
                                            theme.secondary16.withOpacity(0.4),
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
                                        color:
                                            theme.secondary16.withOpacity(0.4),
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
                              alignment: Alignment.centerLeft,
                              child: Padding(
                                padding: const EdgeInsets.only(
                                  left: 16.0,
                                  top: 16.0,
                                  //bottom: 16.0,
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      _getProductNameWithInfo(context),
                                      textAlign: TextAlign.left,
                                      style: Fonts.satoshi(
                                        fontSize: 18.0,
                                        fontWeight: FontWeight.bold,
                                        color: theme.secondary,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            Align(
                              alignment: Alignment.centerLeft,
                              child: Padding(
                                padding: const EdgeInsets.only(
                                  left: 16.0,
                                  top: 16.0,
                                  bottom: 16.0,
                                ),
                                child: Text(
                                  item.description == null
                                      ? ''
                                      : getLocalizedText(
                                          context, item.description!),
                                  textAlign: TextAlign.left,
                                  style: Fonts.satoshi(
                                    color: theme.secondary,
                                    fontWeight: FontWeight.w400,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      StreamBuilder<Cart?>(
                        stream: getIt<CartRepository>()
                            .getCurrentCartStream(unit.id),
                        builder: (context, AsyncSnapshot<Cart?> snapshot) {
                          if (snapshot.connectionState !=
                                  ConnectionState.waiting ||
                              snapshot.hasData) {
                            //return _buildVariantsList(snapshot.data, item.variants);
                            return ProductDetailVariantListWidget(
                              cart: snapshot.data,
                              product: item,
                              unit: unit,
                            );
                          }
                          return CenterLoadingWidget();
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          (item.configSets == null ||
                  (item.configSets != null && item.configSets!.isEmpty))
              ? Container()
              : AddToCartPanelWidget(
                  onAddToCartPressed: (state, quantity) =>
                      _addOrderItemToCart(context, state, quantity),
                )
        ],
      ),
    );
  }

  void _addOrderItemToCart(
      BuildContext context, ConfigsetUpdated state, int quantity) {
    print('_addOrderItemToCart().quantity=$quantity');
    var orderItem = state.orderItem.copyWith(quantity: quantity);
    print('_addOrderItemToCart().orderItem.quantity=$quantity');
    BlocProvider.of<CartBloc>(context)
        .add(AddProductToCartAction(state.unit.id, orderItem));
    Nav.pop();
    getIt<MainNavigationBloc>().add(
      DoMainNavigation(
        pageIndex: 0,
      ),
    );
  }

  String _getProductNameWithInfo(BuildContext context) {
    if (item.variants.length == 1) {
      var variant = item.variants[0];
      double size = variant.pack?.size ?? 0;
      bool isInteger = size == size.toInt().toDouble();
      String sizeText =
          isInteger ? size.toInt().toString() : size.toStringAsFixed(1);
      return '${getLocalizedText(context, item.name)} - ${getLocalizedText(context, variant.variantName)} - ${sizeText} ${variant.pack?.unit ?? ""}';
    }
    return getLocalizedText(context, item.name);
  }
}
