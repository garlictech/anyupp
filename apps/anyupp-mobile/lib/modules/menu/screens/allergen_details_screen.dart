import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_fonts/google_fonts.dart';

class AllergenDetailsScreen extends StatefulWidget {
  final Map<int, String> allergens = {
    1: 'gluten',
    2: 'crustaceans',
    3: 'egg',
    4: 'fish',
    5: 'peanut',
    6: 'milk',
    7: 'soya',
    8: 'treenuts',
    9: 'sulphites',
    10: 'mustard',
    11: 'celery',
    12: 'sesame',
    13: 'lupin',
    14: 'molluscs',
  };

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
    return SliverGrid(
        gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
          maxCrossAxisExtent: 150.0,
          mainAxisSpacing: 10.0,
          crossAxisSpacing: 10.0,
          childAspectRatio: 1.0,
        ),
        delegate: SliverChildBuilderDelegate((context, index) {
          int key = widget.allergens.keys.toList()[index];
          String value = widget.allergens[key];
          return Stack(
            children: [
              Container(
                margin: EdgeInsets.only(
                  left: 4.0,
                  right: 4.0,
                ),
                padding: EdgeInsets.only(
                  top: 10.0,
                  bottom: 10.0,
                  left: 18.0,
                  right: 18.0,
                ),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12.0),
                  border: Border.all(
                    width: 1.5,
                    color: Color(0xFFE7E5D0),
                  ),
                ),
                child: Column(
                  children: [
                    Expanded(
                        flex: 5,
                        child: Padding(
                          padding: const EdgeInsets.all(10.0),
                          child: SvgPicture.asset(getAllergenSvgPath(value)),
                        )),
                    Expanded(
                        flex: 1,
                        child: FittedBox(
                          fit: BoxFit.contain,
                          child: Text(
                            trans("allergens.$value"),
                            textAlign: TextAlign.center,
                            style: GoogleFonts.poppins(
                              //fontSize: 16.0,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF3C2F2F),
                            ),
                          ),
                        ))
                  ],
                ),
              ),
              Positioned(
                  top: 5,
                  left: 15,
                  child: Text(
                    key.toString(),
                    textAlign: TextAlign.center,
                    style: GoogleFonts.poppins(
                      fontSize: 16.0,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF3C2F2F),
                    ),
                  ))
            ],
          );
        }, childCount: widget.allergens.keys.length));
  }

  String getAllergenSvgPath(String allergen) {
    return "assets/allergens/$allergen.svg";
  }
}
