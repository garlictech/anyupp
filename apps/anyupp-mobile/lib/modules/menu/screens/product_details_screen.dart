import 'package:fa_prev/core/core.dart';
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
import 'package:fa_prev/shared/utils/unit_utils.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:fa_prev/shared/widgets/fade_on_scroll_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ProductDetailsScreen extends StatefulWidget {
  final GeoUnit unit;
  final GeneratedProduct item;
  final ProductItemDisplayState displayState;
  final ServingMode? servingMode;

  ProductDetailsScreen({
    Key? key,
    required this.item,
    required this.unit,
    this.displayState = ProductItemDisplayState.NORMAL,
    this.servingMode,
  }) : super(key: key);

  @override
  State<ProductDetailsScreen> createState() => _ProductDetailsScreenState();
}

class _ProductDetailsScreenState extends State<ProductDetailsScreen> {
  final double _expandedHeight = 260.0;

  final GlobalKey<ScaffoldState> _key = GlobalKey<ScaffoldState>();

  final ScrollController _scrollController = ScrollController();

  double titleOpacity = 1.0;

  @override
  Widget build(BuildContext context) {
    var unit = currentUnit!;
    return NetworkConnectionWrapperWidget(
      child: Scaffold(
        key: _key,
        backgroundColor: theme.secondary12,
        body: NestedScrollView(
          controller: _scrollController,
          headerSliverBuilder: (BuildContext context, bool innerBoxIsScrolled) {
            return <Widget>[
              SliverAppBar(
                centerTitle: true,
                expandedHeight: _expandedHeight,
                floating: false,
                snap: false,
                pinned: true,
                backgroundColor: theme.secondary0,
                foregroundColor: theme.secondary,
                primary: true,
                title: FadeOnScroll(
                  scrollController: _scrollController,
                  zeroOpacityOffset: 0.0,
                  fullOpacityOffset: _expandedHeight,
                  child: Text(
                    getLocalizedText(context, widget.item.name),
                    style: Fonts.satoshi(
                      fontSize: 14.0,
                      fontWeight: FontWeight.bold,
                      color: theme.secondary.withOpacity(titleOpacity),
                    ),
                  ),
                ),
                flexibleSpace: FlexibleSpaceBar(
                  background: Container(
                    color: theme.secondary0,
                    padding: const EdgeInsets.only(
                      top: kToolbarHeight + 50,
                      bottom: 16.0,
                    ),
                    child: _ProductDetailsImageWidget(
                      item: widget.item,
                      url: widget.item.image!,
                    ),
                  ),
                ),
                elevation: 4.0,
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
                actions: [
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
                        product: widget.item,
                        unit: unit,
                        iconSize: 22,
                      ),
                    ),
                  ),
                ],
              ),
              // SliverFadeTransition(opacity: opacity)
              SliverPadding(
                padding: EdgeInsets.only(bottom: 0),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    ProductImageAndInfoWidget(
                      item: widget.item,
                    ),
                  ]),
                ),
              ),
            ];
          },
          body: Stack(
            children: [
              ProductDetailsWidget(
                item: widget.item,
                unit: unit,
                displayState: widget.displayState,
                servingMode: widget.servingMode,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class ProductDetailsWidget extends StatelessWidget {
  final GeoUnit unit;
  final GeneratedProduct item;
  final ProductItemDisplayState displayState;
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
                // padding: EdgeInsets.only(top: kToolbarHeight),
                child: Column(
                  children: <Widget>[
                    // ProductImageAndInfoWidget(
                    //   item: item,
                    // ),
                    ProductConfiguratorWidget(
                      product: item,
                      unit: unit,
                      servingMode: servingMode,
                      displayState: displayState,
                    ),
                    if (isDisabled && item.allergens != null)
                      Container(
                        color: theme.secondary12,
                        child: _buildAllergensListWidget(
                          context,
                          item.allergens!,
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
        ),
        if (unit.canOrder)
          Container(
            color: theme.secondary12,
            child: AddToCartPanelWidget(
              displayState: displayState,
              servingMode: servingMode,
              serviceFeePolicy: unit.serviceFeePolicy,
              onAddToCartPressed: (state, quantity) =>
                  _addOrderItemToCart(context, state, quantity),
            ),
          )
      ],
    );
  }

  Widget _buildAllergensListWidget(
      BuildContext context, List<Allergen> allergeens) {
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
    log.d('_addOrderItemToCart().quantity=$quantity');
    var orderItem = state.orderItem.copyWith(quantity: quantity);
    log.d('_addOrderItemToCart().orderItem.quantity=$quantity');
    BlocProvider.of<CartBloc>(context)
        .add(AddProductToCartAction(state.unit, orderItem));
    Nav.pop();
    getIt<MainNavigationBloc>().add(
      DoMainNavigation(
        pageIndex: 0,
      ),
    );
  }

  bool get isDisabled =>
      displayState == ProductItemDisplayState.DISABLED ||
      (displayState == ProductItemDisplayState.SOLDOUT &&
          unit.soldOutVisibilityPolicy == SoldOutVisibilityPolicy.faded);
  bool get isHidden =>
      displayState == ProductItemDisplayState.SOLDOUT &&
      unit.soldOutVisibilityPolicy == SoldOutVisibilityPolicy.invisible;
}

class _ProductDetailsImageWidget extends StatelessWidget {
  final String url;
  final GeneratedProduct item;

  const _ProductDetailsImageWidget(
      {Key? key, required this.url, required this.item})
      : super(key: key);
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => Nav.to(
        ProductImageDetailsScreen(
          product: item,
        ),
        animationType: NavAnim.SLIDEIN_DOWN,
        duration: Duration(milliseconds: 200),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(
          8.0,
        ),
        child: ImageWidget(
          url: url,
          fit: BoxFit.fitHeight,
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
      ),
    );
  }
}

class ProductImageAndInfoWidget extends StatelessWidget {
  final GeneratedProduct item;

  const ProductImageAndInfoWidget({Key? key, required this.item})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: theme.secondary0,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Align(
            alignment: Alignment.centerLeft,
            child: Padding(
              padding: const EdgeInsets.only(
                left: 16.0,
                // top: 16.0,
                bottom: 16.0,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    getLocalizedText(context, item.name),
                    style: Fonts.satoshi(
                      fontSize: 18.0,
                      fontWeight: FontWeight.bold,
                      color: theme.secondary,
                    ),
                  ),
                  Text(
                    item.description == null
                        ? ''
                        : getLocalizedText(context, item.description!),
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
}

class ProductDetailsToolBarButtonsWidget extends StatelessWidget {
  final GeneratedProduct item;
  final GeoUnit unit;

  const ProductDetailsToolBarButtonsWidget(
      {Key? key, required this.item, required this.unit})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
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
    );
  }
}
