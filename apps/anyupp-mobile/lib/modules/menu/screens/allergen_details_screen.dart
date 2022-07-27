import '/core/core.dart';
import '/models.dart';
import '/modules/menu/widgets/allergen_grid_widget.dart';
import '/shared/locale.dart';
import '/shared/widgets/app_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class AllergenDetailsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
          return buildDetailsScreen(context, null);
        },
      ),
    );
  }

  Widget buildDetailsScreen(BuildContext context, GeoUnit? unit) {
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
                String allergenName =
                    enumToString(allergenMap.keys.toList()[index])!;

                int allergenIndex =
                    allergenMap[allergenMap.keys.toList()[index]]!;
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
                      trans(context, 'allergens.disclaimer',
                          [unit?.name ?? 'AnyUpp']),
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
