import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:fa_prev/modules/favorites/favorites.dart';

class FavoritesScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // The appBar head text
      backgroundColor: theme.background2,
      body: BlocBuilder<UnitSelectBloc, UnitSelectState>(
        builder: (context, state) {
          if (state is UnitSelected) {
            return _buildFavorites(context, state.unit);
          }

          return CenterLoadingWidget();
        },
      ),
    );
  }

  Widget _buildFavorites(BuildContext context, GeoUnit unit) {
    FavoritesRepository _repository = getIt<FavoritesRepository>();
    return StreamBuilder<List<GeneratedProduct>>(
        stream: _repository.getFavoritesList(unit.chainId, unit.id),
        builder: (context, AsyncSnapshot<List<GeneratedProduct>> snapshot) {
          if (snapshot.hasData) {
            if (snapshot.data.isNotEmpty) {
              return _buildList(unit, snapshot.data);
            }
            return _buildEmptyList(context);
          } else if (snapshot.hasError) {
            print(snapshot.error);
            return Container(
              child: Center(
                child: Text(
                  '${snapshot.error}',
                  style: TextStyle(
                    color: Colors.red,
                  ),
                ),
              ),
            );
          }
          return CenterLoadingWidget();
        });
  }

  Widget _buildList(GeoUnit unit, List<GeneratedProduct> list) {
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
                  item: list[position],
                  heroPrefix: 'favorites',
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildEmptyList(BuildContext context) {
    return Container(
      child: Center(
        child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              Image.asset(
                'assets/images/no-favorites-icon.png',
                width: 128.0,
                fit: BoxFit.fitWidth,
              ),
              SizedBox(
                height: 60.0,
              ),
              Text(
                trans(context, 'favorites.noFavorites'),
                style: GoogleFonts.poppins(
                  fontSize: 18.0,
                  fontWeight: FontWeight.bold,
                  color: theme.text,
                ),
              )
            ]),
      ),
    );
  }
}
