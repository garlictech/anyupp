import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../domain/entities/entities.dart';
import '../shared/app_theme.dart';
import '../widgets/icon_button.dart';
import '../widgets/product_variant_manager_widget.dart';

class ManageVariantsScreen extends ConsumerWidget {
  final scaffoldKey = GlobalKey<ScaffoldState>();
  final Unit unit;

  ManageVariantsScreen({Key? key, required this.unit}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
        key: scaffoldKey,
        appBar: AppBar(
          backgroundColor: AppTheme.of(context).primaryColor,
          automaticallyImplyLeading: false,
          title: Text(
            'Manage product variants for ${unit.name}',
            style: AppTheme.of(context).title2.override(
                color: Colors.white,
                fontSize: 22,
                fontFamily: AppTheme.of(context).fontFamily),
          ),
          actions: [
            Padding(
              padding: const EdgeInsetsDirectional.fromSTEB(0, 0, 12, 0),
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
          child: SizedBox(
              width: double.infinity,
              height: double.infinity,
              child: Align(
                  alignment: Alignment.center,
                  child: Padding(
                      padding: const EdgeInsets.all(10),
                      child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Padding(
                                padding: const EdgeInsetsDirectional.fromSTEB(
                                    0, 0, 12, 0),
                                child: ProductVariantManagerWidget(
                                    unitId: unit.id, role: "source")),
                            ProductVariantManagerWidget(
                                unitId: unit.id, role: "target")
                          ])))),
        ));
  }
}
