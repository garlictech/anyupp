import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models/GeneratedProduct.dart';
import 'package:fa_prev/modules/menu/widgets/allergen_grid_widget.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

class AllergenDetailsScreen extends StatefulWidget {
  AllergenDetailsScreen({
    Key key,
  }) : super(key: key);

  @override
  _AllergenDetailsScreenState createState() => _AllergenDetailsScreenState();
}

class _AllergenDetailsScreenState extends State<AllergenDetailsScreen> {
  bool isFavorite = false;

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: theme.background,
      statusBarIconBrightness: Brightness.dark,
    ));

    return _buildMain(context);
  }

  Widget _buildMain(
    BuildContext context,
  ) {
    return SafeArea(
      child: Scaffold(
        backgroundColor: theme.background,
        appBar: AppBar(
          leading: Container(
            padding: EdgeInsets.only(
              left: 8.0,
              top: 4.0,
              bottom: 4.0,
            ),
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  width: 1,
                  color: theme.border2,
                ),
              ),
              child: BackButton(
                onPressed: () => Nav.pop(),
                color: theme.text,
              ),
            ),
          ),
          elevation: 0.0,
          iconTheme: IconThemeData(
            color: theme.text, //change your color here
          ),
          backgroundColor: theme.background,
          title: Text(
            trans("allergens.title"),
            style: GoogleFonts.poppins(
              color: Colors.black,
            ),
            //getLocalizedText(context, widget.item.name),
          ),
        ),
        body: buildDetailsScreen(context),
      ),
    );
  }

  Widget buildDetailsScreen(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(14.0),
      child: CustomScrollView(
        physics: BouncingScrollPhysics(),
        slivers: [
          getAllergenGrids(),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (BuildContext context, int index) {
                return Padding(
                  padding:
                      const EdgeInsets.symmetric(vertical: 30, horizontal: 8),
                  child: Text(
                    trans("allergens.disclaimer"),
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      color: Color(0xFF3C2F2F),
                      fontWeight: FontWeight.w500,
                    ),
                    textAlign: TextAlign.justify,
                  ),
                );
              },
              childCount: 1,
            ),
          )
        ],
      ),
    );
  }

  Widget getAllergenGrids() {
    Map<String, int> allergens = GeneratedProduct.allergenMap;
    return SliverGrid(
        gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
          maxCrossAxisExtent: 150.0,
          mainAxisSpacing: 10.0,
          crossAxisSpacing: 10.0,
          childAspectRatio: 1.0,
        ),
        delegate: SliverChildBuilderDelegate((context, index) {
          String allergenName = allergens.keys.toList()[index];
          int allergenIndex = allergens[allergenName];
          return allergenGridWidget(
              allergen: trans("allergens.$allergenName"),
              index: allergenIndex,
              assetPath: "assets/allergens/$allergenName.svg",
              showName: true,
              themeColor: theme.background,
              fontSize: 20);
        }, childCount: allergens.keys.length));
  }
}
