import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:form_builder_validators/form_builder_validators.dart';

import '../../presenters/create_admin_user_screen_presenter.dart';
import '../shared/app_theme.dart';
import '../widgets/app_widgets.dart';
import '../widgets/icon_button.dart';

class CreateAdminUserScreen extends ConsumerWidget {
  final scaffoldKey = GlobalKey<ScaffoldState>();
  final String? adminUserId;

  CreateAdminUserScreen({this.adminUserId = null});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final model = ref.watch(createAdminUserScreenMVPProvider(context));
    final presenter =
        ref.watch(createAdminUserScreenMVPProvider(context).notifier);

    return Scaffold(
        key: scaffoldKey,
        appBar: AppBar(
          backgroundColor: AppTheme.of(context).secondaryBackground,
          automaticallyImplyLeading: false,
          title: Text('Create new admin user'),
          actions: [
            Padding(
              padding: EdgeInsetsDirectional.fromSTEB(0, 0, 12, 0),
              child: AppIconButton(
                borderColor: Colors.transparent,
                borderRadius: 30,
                buttonSize: 48,
                icon: Icon(
                  Icons.close_rounded,
                  color: AppTheme.of(context).secondaryText,
                  size: 30,
                ),
                onPressed: () async {
                  Navigator.pop(context);
                },
              ),
            ),
          ],
          centerTitle: false,
          elevation: 0,
        ),
        backgroundColor: AppTheme.of(context).secondaryBackground,
        body: SafeArea(
          child: Center(
            child: model.waiting
                ? CircularProgressIndicator()
                : SizedBox(
                    width: 300.0,
                    height: 350,
                    child: FormBuilder(
                      key: presenter.formKey,
                      autovalidateMode: AutovalidateMode.disabled,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          Row(children: [
                            Expanded(
                                child: FormBuilderTextField(
                                    name: 'email',
                                    decoration: InputDecoration(
                                      labelText: 'Email',
                                    ),
                                    validator: FormBuilderValidators.compose([
                                      FormBuilderValidators.required(),
                                      FormBuilderValidators.email(),
                                    ])))
                          ]),
                          Row(children: [
                            Expanded(
                                child: FormBuilderTextField(
                                    name: 'name',
                                    decoration: InputDecoration(
                                      labelText: 'Full name',
                                    ),
                                    validator: FormBuilderValidators.compose([
                                      FormBuilderValidators.required(),
                                    ])))
                          ]),
                          Row(children: [
                            Expanded(
                                child: FormBuilderTextField(
                                    name: 'phone',
                                    decoration: InputDecoration(
                                      labelText: 'Phone',
                                    ),
                                    validator: FormBuilderValidators.compose([
                                      FormBuilderValidators.required(),
                                    ])))
                          ]),
                          Row(children: [
                            Expanded(
                              child: AppButtonWidget(
                                onPressed: () => presenter.onSubmit(),
                                text: 'Create',
                                options: AppButtonOptions(
                                  color: AppTheme.of(context).primaryColor,
                                  textStyle:
                                      AppTheme.of(context).subtitle1.override(
                                            fontFamily: 'Poppins',
                                            color: Colors.white,
                                          ),
                                  elevation: 3,
                                  borderSide: BorderSide(
                                    color: Colors.transparent,
                                    width: 1,
                                  ),
                                  borderRadius: 8,
                                ),
                              ),
                            )
                          ]),
                        ],
                      ),
                    ),
                  ),
          ),
        ));
  }
}
