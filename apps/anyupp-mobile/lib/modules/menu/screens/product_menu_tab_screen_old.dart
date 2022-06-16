import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/adbanner/adbanner.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

@deprecated
class ProductMenuTabScreenExternOld extends StatelessWidget {
  final GeoUnit unit;
  final String categoryId;
  final int tabPosition;

  const ProductMenuTabScreenExternOld({
    Key? key,
    required this.unit,
    required this.categoryId,
    required this.tabPosition,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (BuildContext context) {
        var bloc = getIt<ProductListBloc>();
        bloc.add(LoadProductList(
          unitId: unit.id,
          categoryId: categoryId,
        ));
        return bloc;
      },
      child: ProductMenuTabScreenOld(
        unit: unit,
        categoryId: categoryId,
        tabPosition: tabPosition,
      ),
    );
  }
}

class ProductMenuTabScreenOld extends StatefulWidget {
  final GeoUnit unit;
  final String categoryId;
  final int tabPosition;

  const ProductMenuTabScreenOld(
      {required this.unit,
      required this.categoryId,
      required this.tabPosition});

  @override
  _ProductMenuTabScreenOldState createState() =>
      _ProductMenuTabScreenOldState();
}

class _ProductMenuTabScreenOldState extends State<ProductMenuTabScreenOld>
    with AutomaticKeepAliveClientMixin<ProductMenuTabScreenOld> {
  String? _nextToken;
  late int _pageSize;
  RefreshController _refreshController =
      RefreshController(initialRefresh: false);

  @override
  bool get wantKeepAlive => true;

  bool _adBannerHidden = false;

  @override
  void initState() {
    super.initState();
    _pageSize = getIt<AppConstants>().paginationSize;
  }

  void _onRefresh() async {
    BlocProvider.of<ProductListBloc>(context).add(LoadProductList(
        unitId: widget.unit.id,
        categoryId: widget.categoryId,
        nextToken: _nextToken));
    _refreshController.refreshCompleted();
    setState(() {
      _adBannerHidden = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Container(
        color: theme.secondary12.withOpacity(0.5),
        key: PageStorageKey(widget.categoryId),
        padding: EdgeInsets.symmetric(
            horizontal: MediaQuery.of(context).size.width * 0.015),
        child: BlocBuilder<ProductListBloc, ProductListState>(
            builder: (context, state) {
          if (state is ProductListLoading) {
            return const CenterLoadingWidget();
          }

          if (state is ProductListLoaded) {
            var items = state.products;
            if (items.isEmpty) {
              return const ProductEmptyListWidgetOld();
            }
            return BlocBuilder<TakeAwayBloc, TakeAwayState>(
                builder: (context, state) {
              ServingMode? mode;
              if (state is ServingModeSelectedState) {
                mode = state.servingMode;
              }
              // log.d('_buildList.servingMode=$mode');
              bool hasItems = _hasVisibleProducts(
                items,
                mode,
                widget.unit.soldOutVisibilityPolicy,
              );

              int itemCount = items.length;

              // Banner rendering
              bool hasAdBanner = widget.unit.adBannersEnabled == true;
              ImageAsset? banner;
              int bannerIndex = -1;
              if (hasAdBanner) {
                banner = getRandomBanner(
                  banners: widget.unit.adBanners,
                  position: -1,
                );
                bannerIndex = RND.nextInt(items.length);
                itemCount += 1;
              }
              if (banner == null || bannerIndex < 0 || _adBannerHidden) {
                hasAdBanner = false;
                itemCount = items.length;
              }

              return AnimationLimiter(
                  child: SmartRefresher(
                enablePullDown: true,
                header: const MaterialClassicHeader(),
                onRefresh: _onRefresh,
                controller: _refreshController,
                child: !hasItems
                    ? EmptyWidget(
                        icon: 'assets/icons/empty-category.png',
                        messageKey: mode == ServingMode.takeAway
                            ? 'main.category.emptyTakeaway'
                            : 'main.category.emptyInPlace',
                        descriptionKey: 'main.category.emptyHint',
                        textFontSize: 18.0,
                        descriptionFontSize: 14.0,
                        horizontalPadding: 32.0,
                        iconSize: 32.0,
                        background: Colors.transparent,
                      )
                    : ListView.builder(
                        itemCount: itemCount,
                        scrollDirection: Axis.vertical,
                        physics: const BouncingScrollPhysics(),
                        itemBuilder: (context, position) {
                          if (hasAdBanner &&
                              banner != null &&
                              position == bannerIndex) {
                            return AnimationConfiguration.staggeredList(
                              position: position,
                              duration: const Duration(milliseconds: 200),
                              child: SlideAnimation(
                                verticalOffset: 50.0,
                                child: FadeInAnimation(
                                  child: AdBannerCardWidget(
                                      banner: banner,
                                      animated: true,
                                      onClosed: () {
                                        setState(() {
                                          _adBannerHidden = true;
                                        });
                                      }),
                                ),
                              ),
                            );
                          }

                          int pos = position;
                          if (hasAdBanner && position > bannerIndex) {
                            pos--;
                          }
                          var product = items[pos];

                          bool isAvailableInThisServingMode =
                              product.isAvailableInServingMode(mode);
                          bool isSoldOut = product.isSoldOut;
                          ProductItemDisplayState displayState =
                              ProductItemDisplayState.NORMAL;
                          if (isSoldOut &&
                              widget.unit.soldOutVisibilityPolicy ==
                                  SoldOutVisibilityPolicy.invisible) {
                            displayState = ProductItemDisplayState.SOLDOUT;
                          }
                          if (isSoldOut) {
                            displayState = ProductItemDisplayState.SOLDOUT;
                          } else if (!isAvailableInThisServingMode) {
                            displayState = ProductItemDisplayState.DISABLED;
                          }

                          if (pos == itemCount &&
                              itemCount % _pageSize == 0 &&
                              _nextToken != null) {
                            getIt<ProductListBloc>().add(LoadProductList(
                              unitId: widget.unit.id,
                              categoryId: widget.categoryId,
                              nextToken: _nextToken,
                            ));
                          }

                          return AnimationConfiguration.staggeredList(
                            position: pos,
                            duration: const Duration(milliseconds: 200),
                            child: SlideAnimation(
                              verticalOffset: 50.0,
                              child: FadeInAnimation(
                                child: ProductMenuItemWidget(
                                  displayState: displayState,
                                  unit: widget.unit,
                                  item: product,
                                  servingMode: mode ?? ServingMode.inPlace,
                                ),
                              ),
                            ),
                          );
                        },
                      ),
              ));
            });
          }

          return const CenterLoadingWidget();
        }));
  }

  bool _hasVisibleProducts(
    List<GeneratedProduct> list,
    ServingMode? mode,
    SoldOutVisibilityPolicy? soldOutVisibility,
  ) {
    if (mode == null) {
      return list.isNotEmpty;
    }

    bool hasItem = list.indexWhere(
            (product) => product.supportedServingModes.contains(mode)) !=
        -1;

    bool allSoldOut = soldOutVisibility == SoldOutVisibilityPolicy.invisible &&
        list.every((product) => product.isSoldOut);

    return hasItem && !allSoldOut;
  }
}

class ProductEmptyListWidgetOld extends StatelessWidget {
  const ProductEmptyListWidgetOld({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        const SizedBox(height: 20.0),
        Center(
          child: Text(
            trans(context, 'main.categoryEmpty'),
            style: Fonts.satoshi(
              color: theme.secondary,
              fontWeight: FontWeight.normal,
              fontSize: 14,
            ),
          ),
        ),
      ],
    );
  }
}
