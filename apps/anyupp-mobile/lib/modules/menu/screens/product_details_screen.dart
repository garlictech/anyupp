import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:fa_prev/modules/main/main.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ProductDetailsScreen extends StatelessWidget {
  final GeoUnit unit;
  final GeneratedProduct item;
  final ProducItemDisplayState displayState;
  final ServingMode? servingMode;

  ProductDetailsScreen({
    Key? key,
    required this.item,
    required this.unit,
    this.displayState = ProducItemDisplayState.NORMAL,
    this.servingMode,
  }) : super(key: key);

  final GlobalKey<ScaffoldState> _key = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return NetworkConnectionWrapperWidget(
      child: Scaffold(
        key: _key,
        backgroundColor: theme.secondary12,
        appBar: null,
        body: BlocBuilder<UnitSelectBloc, UnitSelectState>(
            builder: (context, unitState) {
          if (unitState is UnitSelected) {
            return Stack(
              children: [
                ProductDetailsWidget(
                  item: item,
                  unit: unit,
                  displayState: displayState,
                  servingMode: servingMode,
                ),
                Positioned(
                  // alignment: Alignment.topCenter,
                  left: 0,
                  top: 32, // kTextTabBarHeight, //32.0,
                  right: 0,
                  child: Container(
                    height: 55.0,
                    // color: Colors.red,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Padding(
                          padding: const EdgeInsets.only(
                            top: 8.0,
                            bottom: 8.0,
                            left: 15.0,
                          ),
                          child: BackButtonWidget(
                            color: theme.secondary,
                          ),
                        ),
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
                              iconSize: 22,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                )
              ],
            );
          }

          return CenterLoadingWidget();
        }),
      ),
    );
  }
}

class ProductDetailsWidget extends StatelessWidget {
  final GeoUnit unit;
  final GeneratedProduct item;
  final ProducItemDisplayState displayState;
  final ServingMode? servingMode;

  const ProductDetailsWidget({
    Key? key,
    required this.unit,
    required this.item,
    required this.displayState,
    this.servingMode,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
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
                padding: EdgeInsets.only(top: kToolbarHeight),
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
                              child: _ProductDetailsImageWidget(
                                url: item.image!,
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
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
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
                                  if (item.variants.length == 1)
                                    Text(
                                      _getProductPackInfo(context),
                                      textAlign: TextAlign.left,
                                      style: Fonts.satoshi(
                                        color: theme.secondary,
                                        fontWeight: FontWeight.w400,
                                        fontSize: 14,
                                      ),
                                    ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (displayState == ProducItemDisplayState.NORMAL)
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
                              servingMode: servingMode,
                            );
                          }
                          return CenterLoadingWidget();
                        },
                      ),
                    if (displayState == ProducItemDisplayState.DISABLED)
                      Container(
                        color: theme.secondary12,
                        child: _buildAllergensListWidget(
                          context,
                          item.allergens!,
                        ),
                      ),
                    if (displayState == ProducItemDisplayState.DISABLED ||
                        item.configSets == null ||
                        (item.configSets != null && item.configSets!.isEmpty))
                      Container(
                        height: MediaQuery.of(context).size.height / 5,
                        color: theme.secondary12,
                      )
                  ],
                ),
              ),
            ),
          ),
        ),
        // (item.configSets == null || (item.configSets != null && item.configSets!.isEmpty))
        //     ? Container()
        Container(
          color: theme.secondary12,
          child: AddToCartPanelWidget(
            displayState: displayState,
            servingMode: servingMode,
            onAddToCartPressed: (state, quantity) =>
                _addOrderItemToCart(context, state, quantity),
          ),
        )
      ],
    );
  }

  Widget _buildAllergensListWidget(
      BuildContext context, List<String> allergeens) {
    if (allergeens.isEmpty) {
      return Container();
    }

    return Container(
      margin: EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.all(
          Radius.circular(
            16.0,
          ),
        ),
        color: theme.secondary0,
      ),
      child: Container(
        width: double.infinity,
        padding: EdgeInsets.only(
          top: 12.0,
          // left: 16.0,
          bottom: 12.0,
          // right: 16.0,
        ),
        child: AllergensWidget(
          allergens: allergeens.toList(),
        ),
      ),
    );
  }

  void _addOrderItemToCart(
      BuildContext context, ConfigsetUpdated state, int quantity) {
    print('_addOrderItemToCart().quantity=$quantity');
    var orderItem = state.orderItem.copyWith(quantity: quantity);
    print('_addOrderItemToCart().orderItem.quantity=$quantity');
    BlocProvider.of<CartBloc>(context)
        .add(AddProductToCartAction(state.unit, orderItem));
    Nav.pop();
    getIt<MainNavigationBloc>().add(
      DoMainNavigation(
        pageIndex: 0,
      ),
    );
  }

  String _getProductPackInfo(BuildContext context) {
    if (item.variants.length == 1) {
      var variant = item.variants[0];
      double size = variant.pack?.size ?? 0;
      String sizeText = formatPackNumber(size);
      return '\n${trans(context, 'product.size')} ${sizeText} ${variant.pack?.unit ?? ""} / ${getLocalizedText(context, variant.variantName)}';
    }
    return '';
  }

  String _getProductNameWithInfo(BuildContext context) {
    return getLocalizedText(context, item.name);
  }
}

class _ProductDetailsImageWidget extends StatelessWidget {
  final String url;

  const _ProductDetailsImageWidget({Key? key, required this.url})
      : super(key: key);
  @override
  Widget build(BuildContext context) {
    return ImageWidget(
      url: url,
      // width: MediaQuery.of(context).size.width / 2.5,
      height: MediaQuery.of(context).size.width / 2,
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
    );
  }
}
