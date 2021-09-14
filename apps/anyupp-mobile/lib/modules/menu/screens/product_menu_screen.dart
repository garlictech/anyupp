import 'package:fa_prev/app-config.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/selectunit/screens/flutter_qr_code_scanner.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_fonts/google_fonts.dart';

import 'product_menu_tab_screen.dart';

class Menu extends StatelessWidget {
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
                if (state.productCategories?.data != null && state.productCategories!.data!.isNotEmpty) {
                  return _buildTabBar(context, unitState.unit, state.productCategories?.data ?? []);
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
      appBar: _createAppBar(context, []),
      backgroundColor: theme.background2,
      body: CenterLoadingWidget(),
    ));
  }

  Widget _buildTabBar(BuildContext context, GeoUnit unit, List<ProductCategory> productCategories) {
    return DefaultTabController(
      length: productCategories.length,
      child: SafeArea(
        child: Scaffold(
          appBar: _createAppBar(context, productCategories),
          backgroundColor: theme.background2,
          body: TabBarView(
            physics: BouncingScrollPhysics(),
            children: productCategories
                .map((category) => ProductMenuTabScreen(
                      unit: unit,
                      categoryId: category.id!,
                    ))
                .toList(),
          ),
        ),
      ),
    );
  }

  AppBar _createAppBar(BuildContext context, List<ProductCategory> productCategories) {
    return AppBar(
      elevation: 0.0,
      backgroundColor: theme.background,
      actions: [
        IconButton(
          icon: SvgPicture.asset(
            'assets/icons/qr_code_scanner.svg',
            color: theme.indicator,
          ),
          onPressed: () => Nav.to(QRCodeScannerScreen()),
        ),
        IconButton(
          icon: Icon(
            Icons.location_on,
            color: theme.indicator,
          ),
          onPressed: () {
            showLocationSelectionBottomSheet(context);
          },
        ),
      ],
      title: Column(
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.only(
              top: 8.0,
              bottom: 8.0,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (theme.images?.header != null)
                  ImageWidget(
                    //width: 200,
                    height: 40,
                    url: theme.images?.header != null
                        ? theme.images?.header
                        : 'https://${AppConfig.S3BucketName}.s3-${AppConfig.Region}.amazonaws.com/public/chains/kajahu-logo.svg',
                    errorWidget: Container(),
                    fit: BoxFit.fitHeight,
                  ),
              ],
            ),
          ),
        ],
      ),

      // centerTitle: true,
      bottom: productCategories.isNotEmpty
          ? ColoredTabBar(
              color: theme.background2,
              tabBar: TabBar(
                isScrollable: productCategories.length > 2,
                indicatorColor: Colors.transparent,
                indicatorSize: TabBarIndicatorSize.tab,
                indicator: CircleTabIndicator(color: theme.indicator, radius: 3),
                labelColor: theme.indicator,
                labelStyle: GoogleFonts.poppins(
                  fontSize: 16.0,
                  fontWeight: FontWeight.w600,
                ),
                unselectedLabelColor: theme.disabled.withOpacity(0.4),
                tabs: productCategories.map((category) => Tab(text: getLocalizedText(context, category.name))).toList(),
              ),
            )
          : null,
    );
  }

  Widget _noCategoriesWidget(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar: _createAppBar(context, []),
        backgroundColor: theme.background,
        body: EmptyWidget(
          messageKey: 'main.noCategories',
        ),
      ),
    );
  }
}
