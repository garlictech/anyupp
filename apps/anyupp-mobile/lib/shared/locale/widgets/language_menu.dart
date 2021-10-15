import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:flutter/material.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';

import 'flag.dart';

class LangChoice {
  final String title;
  final String language;
  final String country;
  final Widget flag;

  LangChoice(
      {required this.title,
      required this.language,
      required this.country,
      required this.flag});
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
        elevation: 0.0,
        backgroundColor: theme.secondary0,
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
                color: theme.secondary.withOpacity(0.2),
              ),
              color: theme.secondary0,
            ),
            child: BackButton(
              color: theme.secondary,
            ),
          ),
        ),
        title: Text(
          trans('profile.menu.language'),
          style: Fonts.satoshi(
            fontSize: 18.0,
            color: theme.secondary,
            fontWeight: FontWeight.w400,
          ),
        ),
        centerTitle: true,
      ),

      body: Container(
          color: theme.secondary0,
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
                        getIt<LocaleBloc>().add(
                            SetLocale(Locale(choice.language, choice.country)));
                      },
                      child: AnimationConfiguration.staggeredList(
                        position: position,
                        duration: const Duration(milliseconds: 200),
                        child: SlideAnimation(
                          verticalOffset: 250.0,
                          child: FadeInAnimation(
                            child: Container(
                              height: 50,
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment
                                    .center, //Center Row contents horizontally,
                                children: <Widget>[
                                  Padding(
                                    padding: const EdgeInsets.only(
                                        left: 0, right: 10.0),
                                    child: choice.flag,
                                  ),
                                  Text(
                                    '${choice.title}',
                                    style: Fonts.satoshi(
                                      color: theme.secondary,
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
                  separatorBuilder: (BuildContext context, int index) =>
                      const Divider(),
                ),
              )
            ],
          ))),
    );
  }
}
