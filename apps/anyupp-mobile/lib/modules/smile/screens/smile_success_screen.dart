import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class SmileSuccessScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        body: Container(
            child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.only(top: 66.0, bottom: 66.0),
              child: SvgPicture.asset(
                'assets/icons/ico-smile_hand_drawn.svg',
                width: 100,
              ),
            ),
            Container(
                color: Color(0xFF30bf60),
                padding: EdgeInsets.only(top: 8, left: 20, right: 30),
                child: _getText('Great.', Colors.white)),
            Padding(
              padding: const EdgeInsets.only(top: 18),
              child: _getText('Thanks.', Color(0xFF373737)),
            ),
            Padding(
              padding: const EdgeInsets.only(left: 16, right: 16, top: 30),
              child: Text(
                'We use computer vision to offer you the best and most relevant service.',
                textAlign: TextAlign.center,
                style: TextStyle(
                    fontFamily: 'Intro',
                    fontSize: 18,
                    fontWeight: FontWeight.w400),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(left: 16, right: 16, top: 30, bottom: 30),
              child: Text(
                'We do not record or store visual or audio data. Like.. at all.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w300),
              ),
            ),
            SizedBox(
              width: 170,
              height: 50,
              child: RaisedButton(
                  color: Color(0xFFb17524),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      Text(
                        'Enter',
                        style: TextStyle(fontSize: 19, color: Colors.white),
                      ),
                      SizedBox(width: 16),
                      Icon(
                        Icons.arrow_forward,
                        color: Colors.white,)
                    ],
                  ),
                  onPressed: () {
                    // TODO Navigation
                    // Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => HomeScreen()));
                  }),
            )
          ],
        )),
      ),
    );
  }

  Widget _getText(String text, Color color) {
    return Text(
      text,
      style: TextStyle(fontFamily: 'ZoojaPro', fontSize: 55, color: color),
    );
  }
}
