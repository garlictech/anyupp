import 'dart:io';

import '/core/core.dart';
import '/shared/locale.dart';
import '/shared/nav.dart';
import '/shared/widgets.dart';
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

  Locale get locale => Locale(language, country);
}

class LanguageMenu extends StatefulWidget {
  @override
  _LanguageMenuState createState() => _LanguageMenuState();
}

class _LanguageMenuState extends State<LanguageMenu> {
  Locale? _selectedLocale;
  final ThemeChainData theme = defaultTheme();

  @override
  void initState() {
    super.initState();
    LocaleState state = getIt<LocaleBloc>().state;
    log.d('LanguageMenu.initState()=$state');
    if (state is LocaleSelected) {
      _selectedLocale = state.locale;
    }

    if (_selectedLocale == null) {
      final String defaultLocale = Platform.localeName;
      log.d('LanguageMenu.defaultLocale()=$defaultLocale');
      if (defaultLocale.startsWith('hu')) {
        _selectedLocale = Locale('hu', 'HU');
      } else {
        _selectedLocale = Locale('en', 'EN');
      }
    }

    log.d('LanguageMenu._selectedLocale()=$_selectedLocale');
  }

  @override
  Widget build(BuildContext context) {
    final List<LangChoice> languageOptions = <LangChoice>[
      LangChoice(
        title: trans('locale.EN'),
        language: 'en',
        country: 'EN',
        flag: Flag('GB'),
      ),
      LangChoice(
        title: trans('locale.HU'),
        language: 'hu',
        country: 'HU',
        flag: Flag('HU'),
      ),
    ];

    return Scaffold(
      // The appBar head text
      appBar: CustomAppBar(title: trans('profile.language.title')),

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
                        setState(() {
                          _selectedLocale = Locale(
                            choice.language,
                            choice.country,
                          );
                        });
                        // getIt<LocaleBloc>().add(SetLocale(_selectedLocale));
                        // Nav.pop();
                      },
                      child: AnimationConfiguration.staggeredList(
                        position: position,
                        duration: const Duration(milliseconds: 200),
                        child: SlideAnimation(
                          verticalOffset: 250.0,
                          child: FadeInAnimation(
                            child: _getRow(choice),
                          ),
                        ),
                      ),
                    );
                  },
                  separatorBuilder: (BuildContext context, int index) =>
                      const Divider(),
                ),
              ),
              Container(
                height: 56.0,
                width: double.infinity,
                margin: EdgeInsets.only(
                  left: 16.0,
                  right: 16.0,
                  top: 16.0,
                  bottom: 46.0,
                ),
                child: ElevatedButton(
                  onPressed: () => _setSelectedLocale(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: theme.button,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(40),
                    ),
                  ),
                  child: Text(
                    trans('profile.language.save'),
                    style: Fonts.satoshi(
                      fontSize: 16.0,
                      fontWeight: FontWeight.w700,
                      color: theme.buttonText,
                    ),
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget _getRow(LangChoice choice) {
    return Container(
      height: 50,
      child: Row(
        mainAxisAlignment:
            MainAxisAlignment.start, //Center Row contents horizontally,
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.only(left: 16.0, right: 16.0),
            child: choice.flag,
          ),
          Expanded(
            child: Text(
              '${choice.title}',
              style: Fonts.satoshi(
                color: theme.secondary,
                fontSize: 15.0,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          Checkbox(
            shape: CircleBorder(),
            activeColor: theme.highlight,
            fillColor: MaterialStateColor.resolveWith((states) {
              if (states.isEmpty) {
                return theme.secondary0;
              }
              var state = states.first;
              switch (state) {
                case MaterialState.selected:
                  return theme.icon;
                default:
                  return theme.secondary0;
              }
            }),
            value: choice.locale == _selectedLocale,
            onChanged: (selected) {
              setState(() {
                _selectedLocale = choice.locale;
              });
            },
          ),
          // Radio<Locale?>(
          //   groupValue: _selectedLocale,
          //   value: choice.locale,
          //   activeColor: theme.primary,
          //   fillColor: MaterialStateColor.resolveWith((states) {
          //     if (states.isEmpty) {
          //       return theme.secondary16;
          //     }
          //     var state = states.first;
          //     switch (state) {
          //       case MaterialState.selected:
          //         return theme.primary;
          //       default:
          //         return theme.secondary16;
          //     }
          //   }),
          //   onChanged: (value) {
          //     setState(() {
          //       _selectedLocale = value;
          //     });
          //     // getIt<LocaleBloc>().add(SetLocale(value));
          //     // Nav.pop();
          //   },
          // ),
        ],
      ),
    );
  }

  _setSelectedLocale() {
    getIt<LocaleBloc>().add(SetLocale(_selectedLocale));
    Nav.pop();
  }
}
