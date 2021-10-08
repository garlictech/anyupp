import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';

class CommonErrorWidget extends StatelessWidget {
  final String error;
  final String? description;
  final String? errorDetails;

  const CommonErrorWidget({required this.error, this.description = '', this.errorDetails = ''});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      padding: EdgeInsets.all(8.0),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline,
              color: Colors.red,
              size: 64.0,
            ),
            SizedBox(
              height: 16.0,
            ),
            Text(
              error,
              textAlign: TextAlign.center,
              style: Fonts.satoshi(
                fontSize: 16.0,
                fontWeight: FontWeight.w400,
                color: Colors.red,
              ),
            ),
            SizedBox(
              height: 8.0,
            ),
            if (description != null)
              Text(
                description!,
                textAlign: TextAlign.center,
                style: Fonts.satoshi(
                  fontSize: 14.0,
                  fontWeight: FontWeight.w400,
                  color: Colors.grey,
                ),
              ),
            if (errorDetails != null)
              Text(
                errorDetails!,
                textAlign: TextAlign.center,
                style: Fonts.satoshi(
                  fontSize: 12.0,
                  fontWeight: FontWeight.w300,
                  color: Colors.grey.withOpacity(0.7),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
