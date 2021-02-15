import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ContactUsScreen extends StatelessWidget {
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0.0,
        backgroundColor: theme.background,
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
                color: theme.highlight.withOpacity(0.2), // Color(0x33857C18),
              ),
              color: theme.background, // Colors.white,
            ),
            child: BackButton(
              color: theme.highlight,
            ),
          ),
        ),
        title: Text(
          trans(context, 'profile.menu.contact'),
          style: GoogleFonts.poppins(
            fontSize: 18.0,
            color: theme.text,
            fontWeight: FontWeight.w400,
          ),
        ),
        centerTitle: true,
      ),
      body: Container(
        child: Center(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              // Display contact us image to the user
              Image.asset(
                "assets/icons/contactUs.jpg",
                height: 190.0,
              ),
              Padding(
                padding: const EdgeInsets.only(top: 25.0),
                child: Text(
                  "We're Happy to Help You!",
                  style: GoogleFonts.poppins(
                    fontSize: 22.0,
                    color: theme.text,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),

              // Display message to the user
              Padding(
                padding: const EdgeInsets.only(top: 15.0, right: 20.0, left: 20.0),
                child: Text(
                  "If you have any complain about \nour services contact me ",
                  style: GoogleFonts.poppins(
                    fontSize: 18.0,
                    color: theme.text,
                    fontWeight: FontWeight.w400,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
