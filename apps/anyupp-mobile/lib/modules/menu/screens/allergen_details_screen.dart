import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/widgets/allergen_grid_widget.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets/app_bar.dart';
import 'package:fa_prev/shared/widgets/loading_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class AllergenDetailsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        backgroundColor: theme.secondary0,
        appBar: CustomAppBar(
          title: trans(context, 'allergens.title'),
          elevation: 4.0,
        ),
        body: BlocBuilder<UnitSelectBloc, UnitSelectState>(
          builder: (context, state) {
            if (state is UnitSelected) {
              return buildDetailsScreen(context, state.unit);
            }
            return CenterLoadingWidget();
          },
        ),
      ),
    );
  }

  Widget buildDetailsScreen(BuildContext context, GeoUnit unit) {
    return Padding(
      padding: const EdgeInsets.only(left: 16.0, right: 16.0, top: 32.0),
      child: CustomScrollView(
        physics: BouncingScrollPhysics(),
        slivers: [
          SliverGrid(
            gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
              maxCrossAxisExtent: 100.0,
              mainAxisSpacing: 10.0,
              crossAxisSpacing: 0.0,
              // childAspectRatio: 1.,
            ),
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                String allergenName = allergenMap.keys.toList()[index];
                int allergenIndex = allergenMap[allergenName]!;
                return AllergenGridWidget(
                  allergen: trans(context, 'allergens.$allergenName'),
                  index: allergenIndex,
                  assetPath: 'assets/allergens/$allergenName.svg',
                  showName: true,
                  fontSize: 12.0,
                  iconSize: 32.0,
                );
              },
              childCount: allergenMap.keys.length,
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (BuildContext context, int index) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(
                        top: 32.0,
                        bottom: 16.0,
                      ),
                      child: Text(
                        trans(context, 'allergens.disclaimerTitle'),
                        style: Fonts.satoshi(
                          fontSize: 18,
                          color: theme.secondary,
                          fontWeight: FontWeight.w700,
                        ),
                        textAlign: TextAlign.justify,
                      ),
                    ),
                    Text(
                      trans(context, 'allergens.disclaimer', [unit.name]),
                      style: Fonts.satoshi(
                        fontSize: 16,
                        color: theme.secondary,
                        fontWeight: FontWeight.w400,
                      ),
                      textAlign: TextAlign.justify,
                    ),
                  ],
                );
              },
              childCount: 1,
            ),
          )
        ],
      ),
    );
  }
}
