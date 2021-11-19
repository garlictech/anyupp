import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/takeaway/bloc/takeaway_bloc.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

class ProductMenuTabScreen extends StatefulWidget {
  final GeoUnit unit;
  final String categoryId;

  const ProductMenuTabScreen({required this.unit, required this.categoryId});

  @override
  _ProductMenuTabScreenState createState() => _ProductMenuTabScreenState();
}

class _ProductMenuTabScreenState extends State<ProductMenuTabScreen>
    with AutomaticKeepAliveClientMixin<ProductMenuTabScreen> {
  String? _nextToken;
  late int _pageSize;

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    _pageSize = getIt<AppConstants>().paginationSize;
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return BlocProvider(
      create: (BuildContext context) {
        var bloc = getIt<ProductListBloc>();
        bloc.add(LoadProductList(unitId: widget.unit.id, categoryId: widget.categoryId, nextToken: _nextToken));
        return bloc;
      },
      child: Container(
        color: theme.secondary12.withOpacity(0.5),
        key: PageStorageKey(widget.categoryId),
        padding: EdgeInsets.symmetric(horizontal: MediaQuery.of(context).size.width * 0.015),
        child: BlocBuilder<ProductListBloc, ProductListState>(builder: (context, state) {
          if (state is ProductListLoading) {
            return CenterLoadingWidget();
          }

          if (state is ProductListLoaded) {
            var items = state.products.data;
            _nextToken = state.products.nextToken;
            if (items == null || items.isEmpty) {
              return _buildEmptyList(context);
            }
            return _buildList(widget.unit, items);
          }

          return CenterLoadingWidget();
        }),
      ),
    );
  }

  Widget _buildList(GeoUnit unit, List<GeneratedProduct> list) {
    return BlocBuilder<TakeAwayBloc, TakeAwayState>(builder: (context, state) {
      ServingMode? mode;
      if (state is ServingModeSelectedState) {
        mode = state.servingMode;
      }
      // print('_buildList.servingMode=$mode');
      bool hasItems = _hasServingModeProducts(list, mode);
      if (!hasItems) {
        return EmptyWidget(
          icon: 'assets/icons/empty-category.png',
          messageKey: mode == ServingMode.takeAway ? 'main.category.emptyTakeaway' : 'main.category.emptyInPlace',
          descriptionKey: 'main.category.emptyHint',
          textFontSize: 18.0,
          descriptionFontSize: 14.0,
          horizontalPadding: 32.0,
          iconSize: 32.0,
          background: Colors.transparent,
        );
      }

      return AnimationLimiter(
        child: ListView.builder(
          itemCount: list.length + 1,
          scrollDirection: Axis.vertical,
          physics: BouncingScrollPhysics(),
          itemBuilder: (context, position) {
            if (position == list.length) {
              return Container(
                height: 80,
                color: theme.secondary12,
              );
            }

            // print('list[$position].supportedServingModes=${list[position].supportedServingModes}');
            // if (mode != null && !list[position].supportedServingModes.contains(mode)) {
            //   return Container();
            // }
            bool isAvailableInThisServingMode = mode != null && list[position].supportedServingModes.contains(mode);
            // print(
            //     'isAvailableInThisServingMode[$mode]=$isAvailableInThisServingMode, items=${list[position].supportedServingModes}');

            if (position == list.length - 1 && list.length % _pageSize == 0 && _nextToken != null) {
              getIt<ProductListBloc>().add(LoadProductList(
                unitId: widget.unit.id,
                categoryId: widget.categoryId,
                nextToken: _nextToken,
              ));
            }

            return AnimationConfiguration.staggeredList(
              position: position,
              duration: const Duration(milliseconds: 200),
              child: SlideAnimation(
                verticalOffset: 50.0,
                child: FadeInAnimation(
                  child: ProductMenuItem(
                    displayState:
                        isAvailableInThisServingMode ? ProducItemDisplayState.NORMAL : ProducItemDisplayState.DISABLED,
                    unit: unit,
                    item: list[position],
                    servingMode: mode,
                  ),
                ),
              ),
            );
          },
        ),
      );
    });
  }

  bool _hasServingModeProducts(List<GeneratedProduct> list, ServingMode? mode) {
    if (mode == null) {
      return list.isNotEmpty;
    }
    return list.indexWhere((product) => product.supportedServingModes.contains(mode)) != -1;
  }

  Widget _buildEmptyList(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        SizedBox(height: 20.0),
        Center(

            // Display message to the user
            child: Text(
          trans('main.categoryEmpty'),
          style: Fonts.satoshi(
            color: theme.secondary,
            fontWeight: FontWeight.normal,
            fontSize: 14,
          ),
        ))
      ],
    );
  }
}
