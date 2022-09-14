import '/core/theme/theme.dart';
import 'package:flutter/material.dart';

class NoNetworkScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () => Future.value(false),
      child: Scaffold(
        backgroundColor: theme.secondary0,
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
                  color: theme.icon,
                ),
                SizedBox(
                  height: 16.0,
                ),
                Text(
                  'No internet connection!',
                  style: Fonts.satoshi(
                    fontSize: 18.0,
                    fontWeight: FontWeight.bold,
                    color: theme.secondary,
                  ),
                ),
                SizedBox(
                  height: 8.0,
                ),
                Text(
                  'Make sure that Wi-Fi or mobil data is turned on, and wait unitl this window disappears.',
                  style: Fonts.satoshi(
                    fontSize: 11.0,
                    color: theme.secondary,
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
