import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/shared/locale/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:fa_prev/modules/login/login.dart';
import 'country_select_dialog.dart';
import 'package:fa_prev/shared/nav.dart';

class PhoneDialogContentWidget extends StatefulWidget {

  final bool linkAccount;

  const PhoneDialogContentWidget({Key key, this.linkAccount = false}) : super(key: key);

  @override
  _PhoneDialogContentWidgetState createState() => _PhoneDialogContentWidgetState();
}

class _PhoneDialogContentWidgetState extends State<PhoneDialogContentWidget> {
  final _phoneNumberController = TextEditingController();
  final _smsCodeController = TextEditingController();

  static const double HEIGHT = 250.0;
  Country _selectedCountry = Country.fromMap(countries.firstWhere((item) => item['code'] == 'HU'));

  String _verificationId;

  @override
  void dispose() {
    _phoneNumberController.dispose();
    _smsCodeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, BaseAuthState>(
      listener: (BuildContext context, BaseAuthState state) {
        // print('PhoneDialogContentWidget.auth.bloc.state=$state');
        if (state is LoginError || state is AuthStateChanged || state is LoginSuccess) {
          Nav.pop();
        }
      },
      child: BlocBuilder<LoginBloc, LoginState>(builder: (BuildContext context, LoginState state) {
        // print('PhoneDialogContentWidget.bloc.state=$state');

        if (state is LoginInProgress) {
          return _buildLoading(context, message: trans('login.phone.loginProgress'));
        }

        if (state is NeedSMSCode) {
          _verificationId = state.verificationId;
          return _buildEnterSMSCodeForm(context);
        }

        return _buildEnterPhoneNumberForm(context);
      }),
    );
  }

  Widget _buildLoading(BuildContext context, {String message = '...'}) {
    return Container(
      height: HEIGHT,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          CenterLoadingWidget(),
          Text(
            message,
            style: GoogleFonts.poppins(
              fontSize: 16.0,
              fontWeight: FontWeight.w500,
              color: Color(0xFF3C2F2F),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildEnterPhoneNumberForm(BuildContext context) {
    return Stack(
      children: [
        Container(
          padding: EdgeInsets.all(12.0),
          height: HEIGHT,
          child: Column(
            children: [
              Container(
                margin: EdgeInsets.only(bottom: 16.0),
                child: Text(
                  trans('login.phone.title'),
                  textAlign: TextAlign.left,
                  style: GoogleFonts.poppins(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w400,
                    color: Color(0xFF3C2F2F),
                  ),
                ),
              ),
              // Phone number input field
              Container(
                margin: EdgeInsets.only(bottom: 16.0),
                child: _buildPhoneTextField(context),
              ),
              Spacer(),
              // Buttons
              SizedBox(
                width: double.infinity,
                height: 52.0,
                child: RaisedButton(
                  child: Text(
                    //transEx(context, 'payment.sendOrder'),
                    trans('login.phone.buttonRequireSMS'),
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      color: Color(0xFFFFFFFF),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  color: Color(0xFF30BF60),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                  onPressed: () => _requireSMSCodeToPhoneNumber(),
                ),
              ),
            ],
          ),
        ),
        _buildCloseButton(context),
      ],
    );
  }

  Widget _buildEnterSMSCodeForm(BuildContext context) {
    return Stack(
      children: [
        Container(
          padding: EdgeInsets.all(12.0),
          height: HEIGHT,
          child: Column(
            children: [
              Container(
                margin: EdgeInsets.only(bottom: 16.0),
                child: Text(
                  trans('login.phone.title'),
                  textAlign: TextAlign.left,
                  style: GoogleFonts.poppins(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w400,
                    color: Color(0xFF3C2F2F),
                  ),
                ),
              ),
              // Phone number input field
              Container(
                margin: EdgeInsets.only(bottom: 16.0),
                child: _buildSMSCodeTextField(context),
              ),
              // Buttons

              SizedBox(
                width: double.infinity,
                height: 52.0,
                child: RaisedButton(
                  child: Text(
                    //transEx(context, 'payment.sendOrder'),
                    trans('login.phone.buttonSendSMSCode'),
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      color: Color(0xFFFFFFFF),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  color: Color(0xFF30BF60),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                  onPressed: () => _sendSMSCode(),
                ),
              ),
            ],
          ),
        ),
        _buildCloseButton(context),
      ],
    );
  }

  Widget _buildPhoneTextField(BuildContext context) {
    return TextField(
      controller: _phoneNumberController,
      autofocus: true,
      keyboardType: TextInputType.number,
      textInputAction: TextInputAction.send,
      cursorColor: Color(0xFF3C2F2F),
      style: GoogleFonts.poppins(
        fontSize: 16.0,
        fontWeight: FontWeight.w400,
        color: Color(0xFF3C2F2F),
      ),
      decoration: InputDecoration(
        alignLabelWithHint: true,
        prefixText: '${_selectedCountry.dialCode}-',
        prefixIcon: IconButton(
          onPressed: () => CountrySelectDialog.show(context, (country) {
            setState(() {
              _selectedCountry = country;
            });
           }),
          icon: Icon(
            Icons.keyboard_arrow_down,
            color: Color(0xFF3C2F2F),
          ),
        ),
        focusColor: Color(0xffe7e5d0),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: BorderSide(
            color: Color(0xffe7e5d0),
            width: 1.0,
          ),
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: BorderSide(
            color: Color(0xffe7e5d0),
            width: 1.0,
          ),
        ),
        labelText: trans('login.phone.phoneNumLabel'),
        labelStyle: GoogleFonts.poppins(
          fontSize: 16.0,
          fontWeight: FontWeight.w400,
          color: Color(0xFF3C2F2F),
        ),
        helperText: trans('login.phone.phoneNumDesc'),
        helperStyle: GoogleFonts.poppins(
          fontSize: 13.0,
          fontWeight: FontWeight.w400,
          color: Color(0xFF3C2F2F).withOpacity(0.5),
        ),
      ),
    );
  }

  Widget _buildSMSCodeTextField(BuildContext context) {
    return TextField(
      controller: _smsCodeController,
      autofocus: true,
      keyboardType: TextInputType.phone,
      textInputAction: TextInputAction.send,
      cursorColor: Color(0xFF3C2F2F),
      style: GoogleFonts.poppins(
        fontSize: 16.0,
        fontWeight: FontWeight.w400,
        color: Color(0xFF3C2F2F),
      ),
      decoration: InputDecoration(
        alignLabelWithHint: true,
        focusColor: Color(0xffe7e5d0),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: BorderSide(
            color: Color(0xffe7e5d0),
            width: 1.0,
          ),
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: BorderSide(
            color: Color(0xffe7e5d0),
            width: 1.0,
          ),
        ),
        labelText: trans('login.phone.smsCodeLabel'),
        labelStyle: GoogleFonts.poppins(
          fontSize: 16.0,
          fontWeight: FontWeight.w400,
          color: Color(0xFF3C2F2F),
        ),
      ),
    );
  }

  Widget _buildCloseButton(BuildContext context) {
    return Positioned(
      right: 0.0,
      top: 0.0,
      child: GestureDetector(
        onTap: () {
          if (Navigator.canPop(context)) {
            Nav.pop();
          }
        },
        child: Align(
          alignment: Alignment.topRight,
          child: CircleAvatar(
            radius: 14.0,
            backgroundColor: Colors.transparent,
            child: Icon(
              Icons.close,
              color: Color(0xFF3C2F2F),
            ),
          ),
        ),
      ),
    );
  }

  void _sendSMSCode() {
    print('requireSMSCodeToPhoneNumber().verificationId=$_verificationId, smsCode=${_smsCodeController.text}');
    getIt<LoginBloc>().add(LoginWithPhoneVerifySMSCode(_verificationId, _smsCodeController.text));
  }

  void _requireSMSCodeToPhoneNumber() {
    print('requireSMSCodeToPhoneNumber()=${_selectedCountry.dialCode}${_phoneNumberController.text}, linkAccount=${widget.linkAccount}');
    getIt<LoginBloc>().add(LoginWithPhoneRequireSMSCode('${_selectedCountry.dialCode}${_phoneNumberController.text}', widget.linkAccount));
  }
}
