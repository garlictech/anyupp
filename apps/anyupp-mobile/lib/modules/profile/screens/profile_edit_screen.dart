import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/shared/locale/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';

class ProfileEditScreen extends StatefulWidget {
  final User? currentProfile;
  const ProfileEditScreen({
    Key? key,
    this.currentProfile,
  }) : super(key: key);

  @override
  _ProfileEditScreenState createState() => _ProfileEditScreenState();
}

class _ProfileEditScreenState extends State<ProfileEditScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();

  bool _showErrorMessage = false;

  @override
  void initState() {
    _emailController.text = widget.currentProfile?.email ?? '';
    if (widget.currentProfile?.name != null) {
      String fullName = widget.currentProfile!.name!;
      if (fullName.contains(' ')) {
        _firstNameController.text =
            fullName.substring(0, fullName.indexOf(' '));
        _lastNameController.text =
            fullName.substring(fullName.indexOf(' ') + 1);
      } else {
        _firstNameController.text = fullName;
        _lastNameController.text = '';
      }
    }
    super.initState();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _firstNameController.dispose();
    _lastNameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: theme.secondary0,
      appBar: CustomAppBar(
        title: trans('profile.edit.title'),
        elevation: 4.0,
      ),
      body: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(16.0),
            topRight: Radius.circular(16.0),
          ),
          color: theme.secondary0,
        ),
        padding: EdgeInsets.only(
          top: 32.0,
          left: 16.0,
          right: 16.0,
        ),
        child: Form(
          key: _formKey,
          child: Theme(
            data: ThemeData().copyWith(
              scaffoldBackgroundColor: Colors.white,
              colorScheme: ThemeData().colorScheme.copyWith(
                    primary: theme.secondary,
                  ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                FormTextFieldWidget(
                  controller: _emailController,
                  readOnly: true,
                  labelKey: 'profile.edit.email',
                  border: BorderRadius.only(
                    topRight: Radius.circular(16.0),
                    bottomRight: Radius.circular(0.0),
                    topLeft: Radius.circular(16.0),
                    bottomLeft: Radius.circular(0.0),
                  ),
                  keyboardType: TextInputType.number,
                  onSaved: (value) {
                    setState(() {});
                  },
                  validator: (value) {
                    return null;
                  },
                ),
                Flex(
                  direction: Axis.horizontal,
                  children: [
                    Flexible(
                      flex: 1,
                      child: FormTextFieldWidget(
                        readOnly: true,
                        controller: _firstNameController,
                        labelKey: 'profile.edit.firstName',
                        border: BorderRadius.only(
                          topRight: Radius.circular(0.0),
                          bottomRight: Radius.circular(0.0),
                          topLeft: Radius.circular(0.0),
                          bottomLeft: Radius.circular(16.0),
                        ),
                        keyboardType: TextInputType.text,
                        onSaved: (value) {
                          setState(() {});
                        },
                        validator: (value) {
                          return null;
                        },
                      ),
                    ),
                    Flexible(
                      flex: 1,
                      child: FormTextFieldWidget(
                        controller: _lastNameController,
                        readOnly: true,
                        labelKey: 'profile.edit.lastName',
                        border: BorderRadius.only(
                          topRight: Radius.circular(0.0),
                          bottomRight: Radius.circular(16.0),
                          topLeft: Radius.circular(0.0),
                          bottomLeft: Radius.circular(0.0),
                        ),
                        keyboardType: TextInputType.text,
                        onSaved: (value) {
                          setState(() {});
                        },
                        validator: (value) {
                          return null;
                        },
                      ),
                    ),
                  ],
                ),
                if (_showErrorMessage)
                  Container(
                    margin: EdgeInsets.only(bottom: 16.0),
                    child: PaymentErrorWidget(
                      messageKey: 'PROFILE SAVE ERROR',
                      onTap: () => setState(() {
                        _showErrorMessage = false;
                      }),
                    ),
                  ),
                Spacer(),
                // Container(
                //   height: 56.0,
                //   width: double.infinity,
                //   margin: EdgeInsets.only(bottom: 16.0),
                //   child: ElevatedButton(
                //     onPressed: () => _updateUserProfile(),
                //     style: ElevatedButton.styleFrom(
                //       primary: theme.primary,
                //       shape: RoundedRectangleBorder(
                //         borderRadius: BorderRadius.circular(40),
                //       ),
                //     ),
                //     child: Text(
                //       trans('profile.edit.save'),
                //       style: Fonts.satoshi(
                //         fontSize: 16.0,
                //         fontWeight: FontWeight.w700,
                //         color: theme.secondary0,
                //       ),
                //     ),
                //   ),
                // )
              ],
            ),
          ),
        ),
      ),
    );
  }

  // Future<void> _updateUserProfile() async {
  //   log.d('_updateUserProfile()');
  // }
}
