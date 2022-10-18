import 'package:anyupp/models/ProductComponent.dart';
import 'package:anyupp/providers/providers.dart';
import 'package:dartz/dartz.dart' as dartz;
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '/core/core.dart';
import '/graphql/generated/crud-api.dart';
import '/models.dart';
import '/modules/favorites/favorites.dart';
import '/modules/menu/menu.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

class FavoritesListWidget extends ConsumerStatefulWidget {
  final Unit unit;
  final ServingMode mode;

  FavoritesListWidget({Key? key, required this.unit, required this.mode})
      : super(key: key);

  @override
  _FavoritesListWidgetState createState() => _FavoritesListWidgetState();
}

class _FavoritesListWidgetState extends ConsumerState<FavoritesListWidget> {
  RefreshController _refreshController =
      RefreshController(initialRefresh: false);

  @override
  void initState() {
    super.initState();
    getIt<FavoritesBloc>().add(ListFavoriteProducts(
      unitId: widget.unit.id,
    ));
  }

  void _onRefresh() async {
    getIt<FavoritesBloc>().add(ListFavoriteProducts(
      unitId: widget.unit.id,
    ));
    _refreshController.refreshCompleted();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<FavoritesBloc, FavoritesState>(
        builder: (context, state) {
      if (state is FavoriteListLoaded) {
        if (state.favorites != null && state.favorites!.isNotEmpty) {
          final componentData = ref.watch(
              productComponentDataOfFavoriteProductsProvider(
                      state.favorites ?? [])
                  .future);
          return FutureBuilder<
                  dartz.Tuple2<List<ProductComponent>, List<ProductComponentSet>>>(
              future: componentData,
              builder: (context, snapshot) {
                return _buildList(widget.unit, state.favorites!,
                    snapshot.data?.value1 ?? [], snapshot.data?.value2 ?? []);
              });
        } else {
          return EmptyWidget(
            icon: 'assets/icons/empty-category.png',
            messageKey: 'favorites.noFavorites',
            descriptionKey: 'favorites.noFavoritesDesc',
            textFontSize: 18.0,
            descriptionFontSize: 14.0,
            horizontalPadding: 32.0,
            iconSize: 32.0,
            background: Colors.transparent,
          );
        }
      }
      return CenterLoadingWidget();
    });
  }

  Widget _buildList(
      Unit unit,
      List<FavoriteProduct> list,
      List<ProductComponent> components,
      List<ProductComponentSet> componentSets) {
    return AnimationLimiter(
      child: SmartRefresher(
        enablePullDown: true,
        header: MaterialClassicHeader(),
        controller: _refreshController,
        onRefresh: _onRefresh,
        child: ListView.builder(
          itemCount: list.length,
          scrollDirection: Axis.vertical,
          physics: BouncingScrollPhysics(),
          itemBuilder: (context, position) {
            bool isAvailableInThisServingMode = list[position]
                .product
                .supportedServingModes
                .contains(widget.mode);
            bool isSoldOut = list[position].product.isSoldOut;
            ProductItemDisplayState displayState =
                ProductItemDisplayState.NORMAL;
            if (isSoldOut) {
              displayState = ProductItemDisplayState.SOLDOUT;
            } else if (!isAvailableInThisServingMode) {
              displayState = ProductItemDisplayState.DISABLED;
            }

            return AnimationConfiguration.staggeredList(
              position: position,
              duration: const Duration(milliseconds: 200),
              child: SlideAnimation(
                verticalOffset: 50.0,
                child: FadeInAnimation(
                  child: ProductMenuItemWidget(
                      displayState: displayState,
                      unit: unit,
                      item: list[position].product,
                      servingMode: widget.mode,
                      components: components,
                      componentSets: componentSets),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
