import '/core/theme/theme.dart';
import '/shared/locale.dart';
import '/shared/widgets/app_bar.dart';
import 'package:flutter/material.dart';

import 'package:package_info/package_info.dart';

class AboutApp extends StatefulWidget {
  @override
  _AboutAppState createState() => _AboutAppState();
}

class _AboutAppState extends State<AboutApp> {
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: theme.secondary0,
      // extendBodyBehindAppBar: true,
      appBar: CustomAppBar(
        elevation: 4.0,
        title: trans('about.title'),
      ),
      body: SingleChildScrollView(
        physics: BouncingScrollPhysics(),
        child: Container(
          // color: Colors.black,
          child: Column(
            children: <Widget>[
              // Display app image to the user

              Container(
                color: theme.secondary0,
                padding: EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 16.0),
                      child: Text(
                        'Anyupp',
                        style: Fonts.satoshi(
                          fontSize: 24.0,
                          fontWeight: FontWeight.w700,
                          color: theme.secondary,
                        ),
                      ),
                    ),
                    Text(
                      trans("about.description"),
                      softWrap: true,
                      textAlign: TextAlign.justify,
                      style: Fonts.satoshi(
                        fontSize: 16.0,
                        color: theme.secondary,
                      ),
                    ),
                    SizedBox(
                      height: 16.0,
                    ),
                    Text(
                      'hello@anyupp.com',
                      style: Fonts.satoshi(
                        color: theme.highlight,
                        fontSize: 16.0,
                        fontWeight: FontWeight.w400,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                    SizedBox(
                      height: 16.0,
                    ),
                    FutureBuilder<PackageInfo>(
                        future: PackageInfo.fromPlatform(),
                        builder:
                            (context, AsyncSnapshot<PackageInfo> snapshot) {
                          return Text(
                            snapshot.hasData
                                ? '${trans("about.version")}: ${snapshot.data!.version}'
                                : '',
                            style: Fonts.satoshi(
                              fontSize: 14.0,
                              color: theme.secondary.withOpacity(0.25),
                            ),
                          );
                        }),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
