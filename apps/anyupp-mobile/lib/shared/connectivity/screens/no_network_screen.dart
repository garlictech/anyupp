import 'package:fa_prev/core/theme/theme.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class NoNetworkScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () => Future.value(false),
      child: Scaffold(
        backgroundColor: theme.background,
        body: Container(
          padding: EdgeInsets.all(
            12.0,
          ),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Icon(
                  Icons.cloud_off,
                  size: 64.0,
                  color: theme.highlight,
                ),
                SizedBox(
                  height: 16.0,
                ),
                Text(
                  'No internet connection!',
                  style: GoogleFonts.poppins(
                    fontSize: 18.0,
                    fontWeight: FontWeight.bold,
                    color: theme.text,
                  ),
                ),
                SizedBox(
                  height: 8.0,
                ),
                Text(
                  'Make sure that Wi-Fi or mobil data is turned on, and wait unitl this window disappears.',
                  style: GoogleFonts.poppins(
                    fontSize: 11.0,
                    color: theme.text,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
