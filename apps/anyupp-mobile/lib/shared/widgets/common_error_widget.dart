import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CommonErrorWidget extends StatelessWidget {
  final String error;
  final String description;

  const CommonErrorWidget({Key key, this.error, this.description = ''}) : super(key: key);

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
              style: GoogleFonts.poppins(
                fontSize: 16.0,
                fontWeight: FontWeight.w400,
                color: Colors.red,
              ),
            ),
            SizedBox(
              height: 8.0,
            ),
            Text(
              description,
              textAlign: TextAlign.center,
              style: GoogleFonts.poppins(
                fontSize: 14.0,
                fontWeight: FontWeight.w400,
                color: Colors.grey,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
