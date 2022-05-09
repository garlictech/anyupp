import 'package:fa_prev/app-config.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/modules/selectunit/widgets/flutter_qr_code_scanner.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:fa_prev/shared/utils/unit_utils.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:flutter_svg/svg.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:simple_tooltip/simple_tooltip.dart';

class Menu extends StatefulWidget {
  @override
  State<Menu> createState() => _MenuState();
}

class _MenuState extends State<Menu> with TickerProviderStateMixin {
  TabController? _tabController;
  bool _showTooltip = false;
  int _selectedTab = 0;
  int? _cachedFromIdx;
  int? _cachedToIdx;

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    _tabController?.dispose();
    super.dispose();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _checkNeedToShowTooltip();
  }

  Future<void> _checkNeedToShowTooltip() async {
    SharedPreferences preferences = await SharedPreferences.getInstance();
    GeoUnit? unit = currentUnit;
    if (unit != null) {
      bool? showed = preferences.getBool('TOOLTIP_${unit.id}');
      // print('_checkNeedToShowTooltip.showed=$showed');
      if (showed == null || showed == false) {
        setState(() {
          _showTooltip = true;
        });
        // ignore: unawaited_futures
        Future.delayed(Duration(seconds: 3)).then((_) {
          if (mounted) {
            setState(() {
              _showTooltip = false;
            });
          }
        });

        await preferences.setBool('TOOLTIP_${unit.id}', true);
      } else {
        _showTooltip = false;
      }
    } else {
      setState(() {
        _showTooltip = false;
        // print('_checkNeedToShowTooltip._showTooltip=$_showTooltip');
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (BuildContext context) => getIt<ProductCategoriesBloc>(),
      child: BlocBuilder<UnitSelectBloc, UnitSelectState>(
        builder: (context, UnitSelectState unitState) {
          if (unitState is UnitSelected) {
            return BlocBuilder<ProductCategoriesBloc, ProductCategoriesState>(
                builder: (context, state) {
              // print('Menu.ProductCategoriesBloc.state=$state');
              if (state is ProductCategoriesLoaded) {
                // print('Menu.ProductCategoriesBloc.categories=${state.productCategories}');
                if (state.productCategories != null &&
                    state.productCategories!.isNotEmpty) {
                  return _buildTabBar(
                      context, unitState.unit, state.productCategories!);
                } else {
                  return _noCategoriesWidget(context);
                }
              }
              return _buildLoadingWidget(context);
            });
          }

          return _buildLoadingWidget(context);
        },
      ),
    );
  }

  Widget _buildLoadingWidget(BuildContext context) {
    return SafeArea(
        child: Scaffold(
      // appBar: _createAppBar(context, []),
      backgroundColor: theme.secondary12,
      body: CenterLoadingWidget(),
    ));
  }

  Widget _buildTabBar(BuildContext context, GeoUnit unit,
      List<ProductCategory> productCategories) {
    _selectedTab = _tabController == null
        ? productCategories.isEmpty
            ? 0
            : 1
        : _tabController!.index;
    _tabController = TabController(
      length: productCategories.length + 1,
      vsync: this,
      initialIndex: _selectedTab,
    );
    _tabController?.addListener(() {
      if (_tabController?.indexIsChanging == false) {
        if (_showTooltip) {
          _checkNeedToShowTooltip();
        }
        _selectedTab = _tabController!.index;
      }
    });

    return SafeArea(
      child: Scaffold(
        appBar: _createAppBar(context, productCategories),
        backgroundColor: theme.secondary12,
        body: TabBarView(
          controller: _tabController,
          physics: BouncingScrollPhysics(),
          children: _getTabBarPages(unit, productCategories),
        ),
      ),
    );
  }

  PreferredSize _createAppBar(
      BuildContext context, List<ProductCategory> productCategories) {
    return PreferredSize(
      preferredSize: Size.fromHeight(115.0), // here the desired height
      child: AppBar(
        elevation: 0.0,
        backgroundColor: theme.secondary0,
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Container(
                  margin: EdgeInsets.only(right: 4.0),
                  child: SimpleTooltip(
                    arrowBaseWidth: 16.0,
                    arrowLength: 8,
                    borderWidth: 1.0,
                    show: _showTooltip && _supportedServiceModeCount > 1,
                    tooltipDirection: TooltipDirection.down,
                    hideOnTooltipTap: true,
                    arrowTipDistance: 4.0,
                    borderRadius: 8.0,
                    backgroundColor: theme.secondary,
                    borderColor: theme.secondary.withOpacity(0.2),
                    ballonPadding: EdgeInsets.zero,
                    content: Container(
                      child: Text(
                        trans('main.tooltip'),
                        softWrap: true,
                        textAlign: TextAlign.center,
                        style: Fonts.satoshi(
                          fontSize: 14.0,
                          fontWeight: FontWeight.w400,
                          color: theme.secondary0,
                          decoration: TextDecoration.none,
                        ),
                      ),
                    ),
                    child: BlocBuilder<TakeAwayBloc, TakeAwayState>(
                        builder: (context, state) {
                      if (state is ServingModeSelectedState) {
                        return AnimatedSwitcher(
                          duration: const Duration(milliseconds: 500),
                          transitionBuilder:
                              (Widget child, Animation<double> animation) {
                            return FadeTransition(
                              child: child,
                              opacity: animation,
                              // scale: animation,
                            );
                          },
                          child: BorderedWidget(
                            key: ValueKey<ServingMode>(state.servingMode),
                            width: 40.0,
                            child: state.servingMode == ServingMode.takeAway
                                ? SvgPicture.asset(
                                    "assets/icons/bag.svg",
                                    color: theme.secondary,
                                    height: 20.0,
                                  )
                                : Padding(
                                    padding: const EdgeInsets.all(6.0),
                                    child: SvgPicture.asset(
                                      'assets/icons/restaurant_menu_black.svg',
                                      height: 20.0,
                                      color: theme.secondary,
                                    ),
                                  ),
                            onPressed: () =>
                                _selectServingMode(context, state.servingMode),
                          ),
                        );
                      }
                      return Container();
                    }),
                  ),
                ),
                Container(
                  margin: EdgeInsets.only(left: 4.0),
                  child: BorderedWidget(
                    onPressed: () {
                      if (_showTooltip == true) {
                        setState(() {
                          _showTooltip = false;
                        });
                      }
                      showModalBottomSheet(
                        context: context,
                        isDismissible: true,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.only(
                            topLeft: Radius.circular(16.0),
                            topRight: Radius.circular(16.0),
                          ),
                        ),
                        enableDrag: true,
                        isScrollControlled: true,
                        elevation: 4.0,
                        backgroundColor: Colors.transparent,
                        builder: (context) {
                          return QRCodeScannerWidget(
                            navigateToCart: true,
                            loadUnits: true,
                          );
                        },
                      );
                    },

                    width: 40.0,
                    child: Padding(
                      padding: const EdgeInsets.all(6.0),
                      child: SvgPicture.asset(
                        'assets/icons/qr_code_scanner_2.svg',
                        height: 20.0,
                        color: theme.secondary,
                      ),
                    ),
                    // child: Icon(
                    //   Icons.link,
                    //   color: theme.secondary,
                    //   size: 20.0,
                    // ),
                  ),
                ),
              ],
            ),
          ),
        ],
        centerTitle: false,
        title: Container(
          margin: const EdgeInsets.only(
            top: 8.0,
            bottom: 8.0,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              BackButtonWidget(
                showBorder: false,
                color: theme.secondary,
                icon: Icons.chevron_left,
                onPressed: () => _resetPlaceAndGoToUnitSelection(currentUnit),
              ),
              // if (theme.images?.header != null)
              ImageWidget(
                //width: 200,
                height: 30,
                url: theme.images?.header != null
                    ? theme.images?.header
                    : 'https://${AppConfig.S3BucketName}.s3-${AppConfig.Region}.amazonaws.com/public/chains/kajahu-logo.svg',
                errorWidget: Container(),
                fit: BoxFit.fitHeight,
              ),
            ],
          ),
        ),

        // centerTitle: true,
        bottom: productCategories.isNotEmpty
            ? PreferredSize(
                preferredSize: const Size.fromHeight(40.0),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Container(
                    width: double.infinity,
                    child: ColoredTabBar(
                      color: theme.secondary0,
                      tabBar: TabBar(
                        physics: BouncingScrollPhysics(),
                        controller: _tabController,
                        isScrollable: true, // productCategories.length > 2,
                        // indicatorColor: Colors.red,
                        indicatorSize: TabBarIndicatorSize.tab,
                        // indicatorWeight: 2.0,
                        // automaticIndicatorColorAdjustment: true,
                        // enableFeedback: true,
                        indicator: BoxDecoration(
                          borderRadius: BorderRadius.circular(
                            56.0,
                          ),
                          color: theme.button,
                        ),
                        labelColor: theme.buttonText,
                        labelStyle: Fonts.satoshi(
                          fontSize: 14.0,
                          fontWeight: FontWeight.w400,
                        ),
                        labelPadding: EdgeInsets.only(
                          left: 4,
                          right: 4,
                          top: 6.0,
                          bottom: 6.0,
                        ),
                        indicatorPadding: EdgeInsets.only(
                          bottom: 15.0,
                          top: 13.0,
                        ),
                        unselectedLabelColor: theme.secondary,
                        unselectedLabelStyle: Fonts.satoshi(
                          fontSize: 14.0,
                        ),
                        tabs: _getTabBarTitles(context, productCategories),
                      ),
                    ),
                  ),
                ),
              )
            : null,
      ),
    );
  }

  List<Widget> _getTabBarPages(
    GeoUnit unit,
    List<ProductCategory> productCategories,
  ) {
    List<Widget> results = [FavoritesScreen()];
    results.addAll(productCategories
        .asMap()
        .entries
        .map((entry) => ProductMenuTabScreenTemp(
              unit: unit,
              categoryId: entry.value.id!,
              tabPosition: entry.key,
            ))
        .toList());
    return results;
  }

  List<Widget> _getTabBarTitles(
    BuildContext context,
    List<ProductCategory> productCategories,
  ) {
    List<Widget> results = [_getTab(trans('main.menu.favorites'), 0)];

    for (int i = 0; i < productCategories.length; i++) {
      results.add(
          _getTab(getLocalizedText(context, productCategories[i].name), i + 1));
    }

    return results;
  }

  Widget _getTab(String title, int index) {
    return Tab(
      // height: 16,
      child: AnimatedBuilder(
        animation: _tabController!.animation as Listenable,
        builder: (ctx, snapshot) {
          final forward = _tabController!.offset > 0;
          final backward = _tabController!.offset < 0;
          int _fromIndex;
          int _toIndex;
          double progress;

          // This value is true during the [animateTo] animation that's triggered when the user taps a [TabBar] tab.
          // It is false when [offset] is changing as a consequence of the user dragging the [TabBarView].
          if (_tabController!.indexIsChanging) {
            _fromIndex = _tabController!.previousIndex;
            _toIndex = _tabController!.index;
            _cachedFromIdx = _tabController!.previousIndex;
            _cachedToIdx = _tabController!.index;
            progress = (_tabController!.animation!.value - _fromIndex).abs() /
                (_toIndex - _fromIndex).abs();
          } else {
            if (_cachedFromIdx == _tabController!.previousIndex &&
                _cachedToIdx == _tabController!.index) {
              // When user tap on a tab bar and the animation is completed, it will execute this block
              // This block will not be called when user draging the TabBarView
              _fromIndex = _cachedFromIdx!;
              _toIndex = _cachedToIdx!;
              progress = 1;
              _cachedToIdx = null;
              _cachedFromIdx = null;
            } else {
              _cachedToIdx = null;
              _cachedFromIdx = null;
              _fromIndex = _tabController!.index;
              _toIndex = forward
                  ? _fromIndex + 1
                  : backward
                      ? _fromIndex - 1
                      : _fromIndex;
              progress = (_tabController!.animation!.value - _fromIndex).abs();
            }
          }
          return Container(
            // height: 48.0,
            padding:
                const EdgeInsets.only(left: 16, right: 16, top: 6, bottom: 7),
            decoration: BoxDecoration(
              color: index == _fromIndex
                  ? Color.lerp(theme.button, theme.secondary12, progress)
                  : index == _toIndex
                      ? Color.lerp(theme.secondary12, theme.button, progress)
                      : Color.lerp(
                          theme.secondary12, theme.secondary12, progress),
              borderRadius: BorderRadius.circular(32),
            ),
            child: Text(title,
                style: Fonts.satoshi(
                  fontSize: 14.0,
                  fontWeight: FontWeight.w500,
                  // color: theme.buttonText
                )),
          );
          // return Tab(
          //   text: title,
          // );
        },
      ),
    );
  }

  Widget _noCategoriesWidget(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar: _createAppBar(context, []),
        backgroundColor: theme.secondary0,
        body: Center(
          child: Container(
            margin: EdgeInsets.symmetric(horizontal: 8.0),
            child: EmptyWidget(
              messageKey: 'main.noCategories',
              background: Colors.transparent,
            ),
          ),
        ),
      ),
    );
  }

  int get _supportedServiceModeCount {
    return currentUnit?.supportedServingModes.length ?? 0;
  }

  void _selectServingMode(BuildContext context, ServingMode current) async {
    print('_selectServingMode.current=$current');
    Cart? cart = getIt.get<CartRepository>().cart;
    print('_selectServingMode.cart=$cart');

    setState(() {
      _showTooltip = false;
    });
    if (_supportedServiceModeCount < 2) {
      return;
    }
    await showSelectServingModeSheetWithDeleteConfirm(
      context,
      cart,
      current,
      initialPosition: current == ServingMode.inPlace ? 0 : 1,
    );
  }

  void _resetPlaceAndGoToUnitSelection(GeoUnit? unit) {
    if (unit != null) {
      getIt<CartBloc>().add(ClearPlaceInCart(unit));
    }
    Nav.reset(OnBoarding());
  }
}
