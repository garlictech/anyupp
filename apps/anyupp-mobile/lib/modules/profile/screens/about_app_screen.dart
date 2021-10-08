import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:flutter/material.dart';

import 'package:package_info/package_info.dart';

class AboutApp extends StatefulWidget {
  @override
  _AboutAppState createState() => _AboutAppState();
}

class _AboutAppState extends State<AboutApp> {
  Widget build(BuildContext context) {
    return Scaffold(
      // backgroundColor: theme.secondary0,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        // toolbarOpacity: 1.0,
        backgroundColor: Colors.transparent,
        elevation: 0.0,
        leading: Container(
          padding: EdgeInsets.only(
            left: 0.0,
            top: 4.0,
            bottom: 4.0,
          ),
          child: Container(
            child: BackButton(
              color: theme.secondary0,
            ),
          ),
        ),
      ),
      body: Column(
        children: [
          Container(
            padding: EdgeInsets.only(
              top: 30.0,
              bottom: 30.0,
              left: 50.0,
              right: 50.0,
            ),
            color: Colors.black,
            child: Image.asset(
              "assets/images/anyupp_logo_large.png",
              alignment: Alignment.center,
              fit: BoxFit.contain,
              height: 120.0,
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              physics: BouncingScrollPhysics(),
              child: Container(
                // color: Colors.black,
                child: Column(
                  children: <Widget>[
                    // Display app image to the user

                    Container(
                      color: theme.secondary0,
                      padding: EdgeInsets.all(10.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: <Widget>[
                          Text(
                            trans("about.description"),
                            softWrap: true,
                            textAlign: TextAlign.justify,
                            style: Fonts.satoshi(
                              fontSize: 14.0,
                              color: theme.secondary,
                            ),
                          ),
                          SizedBox(
                            height: 16.0,
                          ),
                          FutureBuilder<PackageInfo>(
                              future: PackageInfo.fromPlatform(),
                              builder: (context, AsyncSnapshot<PackageInfo> snapshot) {
                                return Text(
                                  snapshot.hasData ? '${trans("about.version")}: ${snapshot.data!.version}' : '',
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
          ),
        ],
      ),
    );
  }
}
