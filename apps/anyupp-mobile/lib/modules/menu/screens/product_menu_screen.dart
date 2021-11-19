import 'package:fa_prev/app-config.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/modules/selectunit/screens/flutter_qr_code_scanner.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:flutter_svg/svg.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:simple_tooltip/simple_tooltip.dart';

import 'product_menu_tab_screen.dart';

class Menu extends StatefulWidget {
  @override
  State<Menu> createState() => _MenuState();
}

class _MenuState extends State<Menu> with TickerProviderStateMixin {
  TabController? _tabController;
  bool _showTooltip = false;

  @override
  void initState() {
    super.initState();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _checkNeedToShowTooltip();
  }

  Future<void> _checkNeedToShowTooltip() async {
    SharedPreferences preferences = await SharedPreferences.getInstance();
    GeoUnit? unit = _unit;
    if (unit != null) {
      bool? showed = preferences.getBool('TOOLTIP_${unit.id}');
      // print('_checkNeedToShowTooltip.showed=$showed');
      if (showed == null || showed == false) {
        await preferences.setBool('TOOLTIP_${unit.id}', true);
      }
      setState(() {
        _showTooltip = showed == null || showed == false;
        // print('_checkNeedToShowTooltip._showTooltip=$_showTooltip');
      });
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
            return BlocBuilder<ProductCategoriesBloc, ProductCategoriesState>(builder: (context, state) {
              // print('Menu.ProductCategoriesBloc.state=$state');
              if (state is ProductCategoriesLoaded) {
                // print('Menu.ProductCategoriesBloc.categories=${state.productCategories}');
                if (state.productCategories != null && state.productCategories!.isNotEmpty) {
                  return _buildTabBar(context, unitState.unit, state.productCategories!);
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

  Widget _buildTabBar(BuildContext context, GeoUnit unit, List<ProductCategory> productCategories) {
    _tabController = TabController(
      length: productCategories.length + 1,
      vsync: this,
      initialIndex: _tabController == null
          ? productCategories.isEmpty
              ? 0
              : 1
          : _tabController!.index,
    );

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

  PreferredSize _createAppBar(BuildContext context, List<ProductCategory> productCategories) {
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
                    animationDuration: Duration(milliseconds: 0),
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
                    child: BlocBuilder<TakeAwayBloc, TakeAwayState>(builder: (context, state) {
                      if (state is ServingModeSelectedState) {
                        return AnimatedSwitcher(
                          duration: const Duration(milliseconds: 500),
                          transitionBuilder: (Widget child, Animation<double> animation) {
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
                                    ),
                                  ),
                            onPressed: () => _selectServingMode(context, state.servingMode),
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
                    onPressed: () => Nav.to(QRCodeScannerScreen()),
                    width: 40.0,
                    child: Padding(
                      padding: const EdgeInsets.all(6.0),
                      child: SvgPicture.asset(
                        'assets/icons/qr_code_scanner_2.svg',
                        height: 20.0,
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
                onPressed: () => _resetPlaceAndGoToUnitSelection(_unit),
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
                        // overlayColor: MaterialStateColor.resolveWith((states) {
                        //   print('MaterialStateColor.resolveWith=$states');
                        //   if (states.isEmpty) {
                        //     return theme.secondary16;
                        //   }
                        //   var state = states.first;
                        //   switch (state) {
                        //     case MaterialState.selected:
                        //       return theme.primary;
                        //     default:
                        //       return theme.secondary16;
                        //   }
                        // }),
                        indicator: BoxDecoration(
                          borderRadius: BorderRadius.circular(
                            56.0,
                          ),
                          color: theme.primary,
                        ),
                        labelColor: theme.secondary0,
                        labelStyle: Fonts.satoshi(
                          fontSize: 14.0,
                          fontWeight: FontWeight.w400,
                        ),
                        labelPadding: EdgeInsets.only(
                          left: 16,
                          right: 16,
                          top: 6.0,
                          bottom: 6.0,
                        ),
                        indicatorPadding: EdgeInsets.only(
                          bottom: 12.0,
                          top: 12.0,
                        ),
                        unselectedLabelColor: theme.secondary, //theme.secondary64.withOpacity(0.4),
                        unselectedLabelStyle: Fonts.satoshi(
                          fontSize: 14.0,
                        ),
                        // padding: EdgeInsets.zero,
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

  List<Widget> _getTabBarPages(GeoUnit unit, List<ProductCategory> productCategories) {
    List<Widget> results = [
      FavoritesScreen(),
    ];
    results.addAll(productCategories
        .map((category) => ProductMenuTabScreen(
              unit: unit,
              categoryId: category.id!,
            ))
        .toList());
    return results;
  }

  List<Widget> _getTabBarTitles(BuildContext context, List<ProductCategory> productCategories) {
    List<Widget> results = [
      Tab(
        text: trans(
          'main.menu.favorites',
        ),
      )
    ];

    results.addAll(productCategories
        .map(
          (category) => Tab(
            text: getLocalizedText(
              context,
              category.name,
            ),
          ),
        )
        .toList());

    return results;
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
    var state = getIt<UnitSelectBloc>().state;
    if (state is UnitSelected) {
      return state.unit.supportedServingModes.length;
    }
    return 0;
  }

  GeoUnit? get _unit {
    var state = getIt<UnitSelectBloc>().state;
    if (state is UnitSelected) {
      return state.unit;
    }
    return null;
  }

  void _selectServingMode(BuildContext context, ServingMode current) async {
    setState(() {
      _showTooltip = false;
    });
    if (_supportedServiceModeCount < 2) {
      return;
    }
    var selectedMethodPos = await showSelectServingModeSheet(
      context,
      initialPosition: current == ServingMode.inPlace ? 0 : 1,
    );
    if (selectedMethodPos != null && (current == ServingMode.inPlace ? 0 : 1) != selectedMethodPos) {
      _deleteCartConfirmation(context, selectedMethodPos == 0 ? ServingMode.inPlace : ServingMode.takeAway);
    }
  }

  void _deleteCartConfirmation(BuildContext context, ServingMode servingMode) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(
            transEx(
              context,
              servingMode == ServingMode.takeAway
                  ? 'servingModeSheet.dialog.title.inplace'
                  : 'servingModeSheet.dialog.title.takeaway',
            ),
            style: Fonts.satoshi(
              fontSize: 17,
              fontWeight: FontWeight.w600,
              color: theme.secondary,
            ),
          ),
          content: Text(
            transEx(context, 'servingModeSheet.dialog.description'),
            style: Fonts.satoshi(
              fontSize: 13,
              fontWeight: FontWeight.w400,
              color: theme.secondary,
            ),
          ),
          actions: [
            TextButton(
              child: Text(
                transEx(context, 'servingModeSheet.dialog.cancel'),
                style: Fonts.satoshi(
                  fontSize: 17,
                  fontWeight: FontWeight.w400,
                  color: theme.secondary,
                ),
              ),
              onPressed: () {
                Navigator.pop(context);
              },
            ),
            TextButton(
              child: Text(
                transEx(context, 'servingModeSheet.dialog.ok'),
                style: Fonts.satoshi(
                  fontSize: 17,
                  fontWeight: FontWeight.w600,
                  color: theme.primary,
                ),
              ),
              onPressed: () async {
                Nav.pop();
                getIt<CartBloc>().add(ClearCartAction());
                getIt<TakeAwayBloc>().add(SetServingMode(servingMode));
              },
            ),
          ],
        );
      },
    );
  }

  void _resetPlaceAndGoToUnitSelection(GeoUnit? unit) {
    if (unit != null) {
      getIt<CartBloc>().add(ClearPlaceInCart(unit));
    }
    Nav.reset(OnBoarding());
  }
}
