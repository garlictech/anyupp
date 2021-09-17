import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:flutter/material.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:google_fonts/google_fonts.dart';

import 'flag.dart';

class LangChoice {
  final String title;
  final String language;
  final String country;
  final Widget flag;

  LangChoice({required this.title, required this.language, required this.country, required this.flag});
}

class LanguageMenu extends StatefulWidget {
  @override
  _LanguageMenuState createState() => _LanguageMenuState();
}

class _LanguageMenuState extends State<LanguageMenu> {
  @override
  Widget build(BuildContext context) {
    final List<LangChoice> languageOptions = <LangChoice>[
      LangChoice(
        title: trans('locale.DE'),
        language: 'de',
        country: 'DE',
        flag: Flag('DE', height: 20, width: 20),
      ),
      LangChoice(
        title: trans('locale.EN'),
        language: 'en',
        country: 'EN',
        flag: Flag('GB', height: 20, width: 20),
      ),
      LangChoice(
        title: trans('locale.HU'),
        language: 'hu',
        country: 'HU',
        flag: Flag('HU', height: 20, width: 20),
      ),
    ];

    return Scaffold(
      // The appBar head text
      appBar: AppBar(
        title: Text(trans("profile.menu.language")),
        centerTitle: true,
      ),
      body: Container(
          child: Center(
              child: Column(
        children: <Widget>[
          Expanded(
            child: ListView.separated(
              itemCount: languageOptions.length,
              itemBuilder: (context, position) {
                var choice = languageOptions[position];
                return InkWell(
                  onTap: () {
                    getIt<LocaleBloc>().add(SetLocale(Locale(choice.language, choice.country)));
                  },
                  child: AnimationConfiguration.staggeredList(
                    position: position,
                    duration: const Duration(milliseconds: 375),
                    child: SlideAnimation(
                      verticalOffset: 250.0,
                      child: FadeInAnimation(
                        child: Container(
                          height: 50,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center, //Center Row contents horizontally,
                            children: <Widget>[
                              Padding(
                                padding: const EdgeInsets.only(left: 0, right: 10.0),
                                child: choice.flag,
                              ),
                              Text(
                                '${choice.title}',
                                style: GoogleFonts.poppins(
                                  color: theme.text,
                                  fontSize: 15.0,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              },
              separatorBuilder: (BuildContext context, int index) => const Divider(),
            ),
          )
        ],
      ))),
    );
  }
}
