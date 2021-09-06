import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:package_info/package_info.dart';

class AboutApp extends StatefulWidget {
  @override
  _AboutAppState createState() => _AboutAppState();
}

class _AboutAppState extends State<AboutApp> {
  Widget build(BuildContext context) {
    return Scaffold(
      // The appBar head text
      appBar: AppBar(
        title: Text(
          trans("profile.menu.about"),
        ),
        centerTitle: true,
      ),
      backgroundColor: theme.background,
      body: SingleChildScrollView(
        physics: BouncingScrollPhysics(),
        child: Container(
          color: Colors.black,
          child: Column(
            children: <Widget>[
              // Display app image to the user
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
                  fit: BoxFit.cover,
                ),
              ),
              Container(
                color: theme.background,
                padding: EdgeInsets.all(10.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: <Widget>[
                    Text(
                      trans("about.description"),
                      softWrap: true,
                      textAlign: TextAlign.justify,
                      style: GoogleFonts.poppins(
                        fontSize: 14.0,
                        color: Colors.black,
                      ),
                    ),
                    SizedBox(
                      height: 16.0,
                    ),
                    // if (stage != 'prod')
                    //   Text(
                    //     'Stage: ${DotEnv().env["stage"]}',
                    //     style: GoogleFonts.poppins(
                    //       fontSize: 14.0,
                    //       color: Colors.grey,
                    //     ),
                    //   ),
                    FutureBuilder<PackageInfo>(
                        future: PackageInfo.fromPlatform(),
                        builder: (context, AsyncSnapshot<PackageInfo> snapshot) {
                          return Text(
                            snapshot.hasData ? '${trans("about.version")}: ${snapshot.data!.version}' : '',
                            style: GoogleFonts.poppins(
                              fontSize: 14.0,
                              color: Colors.grey,
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
