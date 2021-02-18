import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:google_fonts/google_fonts.dart';

import 'success_animation_widget.dart';

showSuccessDialog(BuildContext context, String title, String message, [VoidCallback onClose]) {
  SchedulerBinding.instance.addPostFrameCallback((_) {
    showDialog(
      context: context,
      barrierDismissible: true,
      child: SimpleDialog(
        children: <Widget>[
          Padding(
            padding: EdgeInsets.fromLTRB(0.0, 20.0, 0.0, 20.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                SizedBox(
                  width: 64.0,
                  height: 64.0,

                  // Check mark animation
                  child: SuccessAnimationWidget(),
                ),
                SizedBox(
                  height: 32.0,
                ),
                Text(
                  title,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w400,
                    color: Colors.green,
                  ),
                ),
                // Display message to the user
                Padding(
                  padding: const EdgeInsets.only(
                    top: 20.0,
                    left: 4.0,
                    right: 4.0,
                  ),
                  child: Text(
                    message,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 15.0,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                )
              ],
            ),
          )
        ],
      ),
    ).then((value) => onClose != null ? onClose() : null);
  });
}
