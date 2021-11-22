import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';

class FavoritesListWidget extends StatefulWidget {
  final GeoUnit unit;
  final ServingMode mode;

  FavoritesListWidget({Key? key, required this.unit, required this.mode}) : super(key: key);

  @override
  _FavoritesListWidgetState createState() => _FavoritesListWidgetState();
}

class _FavoritesListWidgetState extends State<FavoritesListWidget> {
  @override
  void initState() {
    super.initState();
    getIt<FavoritesBloc>().add(ListFavoriteProducts(
      unitId: widget.unit.id,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      child: BlocBuilder<FavoritesBloc, FavoritesState>(builder: (context, state) {
        if (state is FavoriteListLoaded) {
          if (state.favorites != null && state.favorites!.isNotEmpty) {
            return _buildList(widget.unit, state.favorites!);
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
      }),
    );
  }

  Widget _buildList(GeoUnit unit, List<FavoriteProduct> list) {
    return AnimationLimiter(
      child: ListView.builder(
        itemCount: list.length,
        scrollDirection: Axis.vertical,
        physics: BouncingScrollPhysics(),
        itemBuilder: (context, position) {
          bool isAvailableInThisServingMode = list[position].product.supportedServingModes.contains(widget.mode);
          return AnimationConfiguration.staggeredList(
            position: position,
            duration: const Duration(milliseconds: 200),
            child: SlideAnimation(
              horizontalOffset: 100.0,
              child: FadeInAnimation(
                child: ProductMenuItem(
                  displayState:
                      isAvailableInThisServingMode ? ProducItemDisplayState.NORMAL : ProducItemDisplayState.DISABLED,
                  unit: unit,
                  item: list[position].product,
                  servingMode: widget.mode,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
