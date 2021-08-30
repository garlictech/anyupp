import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';

class SplashScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final height = MediaQuery.of(context).size.height;
    final iOS = Theme.of(context).platform == TargetPlatform.iOS;

    return SafeArea(
      bottom: !iOS,
      top: !iOS,
      child: Scaffold(
        backgroundColor: Colors.white,
        body: Stack(
          children: [
            // BACKGROUND IMAGE
            Positioned(
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              child: _buildBackground(context),
            ),

            // Center logo
            Positioned(
              top: (height / 2.0 - 50),
              left: 0.0,
              right: 0.0,
              child: _buildLogo(context),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBackground(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        image: DecorationImage(
          image: AssetImage('assets/images/anyapp_background.jpg'),
          fit: BoxFit.cover,
        ),
      ),
      child: Container(
        // Set gradient black in image splash screen
        decoration: BoxDecoration(
          color: Color.fromRGBO(0, 0, 0, 0.65),
        ),
      ),
    );
  }

  Widget _buildLogo(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        SvgPicture.asset(
          'assets/icons/any_app_logo.svg',
          width: 40.0,
          height: 50.0,
          fit: BoxFit.fill,
        ),
        SizedBox(
          width: 8.0,
        ),
        Text.rich(
          TextSpan(
            style: GoogleFonts.hammersmithOne(
              fontSize: 30,
              color: const Color(0xffffffff),
            ),
            children: [
              TextSpan(
                text: 'Any',
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                ),
              ),
              TextSpan(
                text: 'Upp',
                style: TextStyle(
                  color: const Color(0xff30bf60),
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          textAlign: TextAlign.left,
        ),
      ],
    );
  }
}
