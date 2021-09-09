import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:fa_prev/modules/main/main.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';

class FavoritesListWidget extends StatefulWidget {
  final GeoUnit unit;

  FavoritesListWidget({Key? key, required this.unit}) : super(key: key);

  @override
  _FavoritesListWidgetState createState() => _FavoritesListWidgetState();
}

class _FavoritesListWidgetState extends State<FavoritesListWidget> {
  @override
  void initState() {
    super.initState();
    getIt<FavoritesBloc>().add(ListFavoriteProducts(unitId: widget.unit.id!));
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      child: _buildFavorites(context, widget.unit),
    );
  }

  Widget _buildFavorites(BuildContext context, GeoUnit unit) {
    return BlocBuilder<FavoritesBloc, FavoritesState>(builder: (context, state) {
      if (state is FavoriteListLoaded) {
        if (state.favorites != null && state.favorites!.isNotEmpty) {
          return _buildList(unit, state.favorites!);
        } else {
          return EmptyWidget(
            messageKey: 'favorites.noFavorites',
            descriptionKey: 'favorites.noFavoritesDesc',
            buttonTextKey: 'favorites.noFavoritesButton',
            onTap: () => getIt<MainNavigationBloc>().add(
              DoMainNavigation(
                pageIndex: 0,
              ),
            ),
            // onTap: () {
            //   showNotification(
            //     context,
            //     transEx(context, "notifications.messageFrom"),
            //     transEx(context, "notifications.orderReady"),
            //     MainNavigation(
            //       pageIndex: 2,
            //     ),
            //   );
            // },
          );
        }
      }
      return CenterLoadingWidget();
    });
  }

  Widget _buildList(GeoUnit unit, List<FavoriteProduct> list) {
    return AnimationLimiter(
      child: ListView.builder(
        itemCount: list.length,
        scrollDirection: Axis.vertical,
        physics: BouncingScrollPhysics(),
        itemBuilder: (context, position) {
          return AnimationConfiguration.staggeredList(
            position: position,
            duration: const Duration(milliseconds: 375),
            child: SlideAnimation(
              horizontalOffset: 100.0,
              child: FadeInAnimation(
                child: ProductMenuItem(
                  unit: unit,
                  item: list[position].product,
                  heroPrefix: 'favorites',
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
