import '/core/core.dart';
import '/models.dart';
import '/modules/cart/cart.dart';
import '/modules/login/login.dart';
import '/modules/selectunit/selectunit.dart';
import '/shared/auth.dart';
import '/shared/locale.dart';
import '/shared/nav.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

import '../widgets/flutter_qr_code_scanner.dart';

class SelectUnitChooseMethodScreen extends StatefulWidget {
  final Uri? initialUri;
  SelectUnitChooseMethodScreen({this.initialUri, Key? key}) : super(key: key);
  @override
  _SelectUnitChooseMethodScreenState createState() =>
      _SelectUnitChooseMethodScreenState();
}

class _SelectUnitChooseMethodScreenState
    extends State<SelectUnitChooseMethodScreen> {
  @override
  void initState() {
    super.initState();
    getIt<CartBloc>().add(ResetCartInMemory());
    getIt<UnitsBloc>().add(DetectLocationAndLoadUnits());
    setToolbarThemeV1(theme);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<User?>(
        future: getIt<AuthRepository>().getAuthenticatedUserProfile(),
        builder: (BuildContext context, AsyncSnapshot<User?> userSnapshot) {
          if (userSnapshot.hasData) {
            return Scaffold(
                key: const Key('unitselect-screen'),
                backgroundColor: Colors.white,
                body: Container(
                  padding: const EdgeInsets.only(top: kToolbarHeight),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: <Widget>[
                      SelectUnitUserInfoRowWidget(user: userSnapshot.data!),
                      Expanded(
                          child: SelectUnitMainContentWidget(
                        initialUri: widget.initialUri,
                      )),
                    ],
                  ),
                ));
          }
          return CenterLoadingWidget(
            backgroundColor: Colors.white,
          );
        });
  }
}

class SelectUnitMainContentWidget extends StatefulWidget {
  final Uri? initialUri;
  const SelectUnitMainContentWidget({this.initialUri, Key? key})
      : super(key: key);

  @override
  State<SelectUnitMainContentWidget> createState() =>
      _SelectUnitMainContentWidgetState();
}

class _SelectUnitMainContentWidgetState
    extends State<SelectUnitMainContentWidget> {
  RefreshController _refreshController =
      RefreshController(initialRefresh: false);
  UniqueKey pageKey = UniqueKey();

  void _onRefresh() async {
    getIt<CartBloc>().add(ResetCartInMemory());
    getIt<UnitsBloc>().add(DetectLocationAndLoadUnits());
    _refreshController.refreshCompleted();
  }

  @override
  Widget build(BuildContext context) {
    return SmartRefresher(
      enablePullDown: true,
      header: MaterialClassicHeader(),
      controller: _refreshController,
      onRefresh: _onRefresh,
      child: SingleChildScrollView(
        child: Container(
          padding: EdgeInsets.all(15.0),
          child: Column(
            children: [
              // --- Scan QR Code card
              SelectUnitQRCardWidget(
                key: pageKey,
                initialUri: widget.initialUri,
              ),
              // --- Nearest place list
              Container(
                width: double.infinity,
                padding: EdgeInsets.only(
                  top: 35.0,
                  bottom: 12.0,
                ),
                child: Text(
                  trans('selectUnit.findNearest'),
                  textAlign: TextAlign.start,
                  style: Fonts.satoshi(
                    fontSize: 14.0,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF3C2F2F),
                  ),
                ),
              ),
              BlocBuilder<UnitsBloc, UnitsState>(builder: (context, state) {
                // log.d('*********** _buildUnitListBloc().BlocBuilder.state=$state');
                if (state is UnitsNoNearUnit) {
                  return Container(
                    padding: EdgeInsets.all(0.0),
                    height: 138,
                    child: Center(
                      child: Text(
                        trans('selectUnitMap.noNearUnits'),
                      ),
                    ),
                  );
                }
                if (state is UnitsNotLoaded) {
                  return Container(
                    padding: EdgeInsets.all(0.0),
                    height: 138,
                    child: Center(
                      child: Text(
                        trans('selectUnitMap.notLoaded'),
                      ),
                    ),
                  );
                }
                if (state is UnitsLoaded) {
                  return Container(
                    padding: EdgeInsets.all(0.0),
                    height: 138,
                    child: ListView.builder(
                      itemCount: state.units.length,
                      scrollDirection: Axis.horizontal,
                      physics: BouncingScrollPhysics(),
                      itemBuilder: (context, index) {
                        return UnitCardWidget(
                          unit: state.units[index],
                          onTap: () => selectUnitAndGoToMenuScreen(
                            context,
                            state.units[index],
                            deletePlace: true,
                            useTheme: false,
                          ),
                        );
                      },
                    ),
                  );
                }
                return Container(
                  padding: EdgeInsets.all(0.0),
                  height: 138,
                  child: CenterLoadingWidget(
                    backgroundColor: Colors.white,
                    color: Color(0xFF857C18),
                  ),
                );
              }),

              // --- Bottom button ('Check them all on the map')
              Container(
                width: double.infinity,
                height: 52.0,
                margin: EdgeInsets.only(top: 16.0),
                child: TextButton(
                  style: TextButton.styleFrom(
                    backgroundColor: Color(0xFFF3F2E7),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                  ),
                  onPressed: () => Nav.to(SelectUnitMapScreen()),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        trans('selectUnit.checkAllOnMap'),
                        style: Fonts.satoshi(
                          fontSize: 14,
                          color: Color(0xFF3C2F2F),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      Icon(
                        Icons.navigate_next,
                        color: Color(0xFF9F6C36),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class SelectUnitUserInfoRowWidget extends StatelessWidget {
  final User user;
  const SelectUnitUserInfoRowWidget({Key? key, required this.user})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 14.0, right: 14.0, bottom: 14.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          if (user.profileImage != null)
            Container(
              width: 46.0,
              height: 46.0,
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.7),
                image: user.profileImage != null
                    ? DecorationImage(
                        image: NetworkImage(user.profileImage!),
                        fit: BoxFit.cover,
                      )
                    : null,
                borderRadius: BorderRadius.all(
                  Radius.circular(10.0),
                ),
              ),
            ),
          if (user.profileImage == null)
            Container(
              width: 46.0,
              height: 46.0,
              decoration: BoxDecoration(
                color: Color(0xFF857C18),
                borderRadius: BorderRadius.all(
                  Radius.circular(10.0),
                ),
              ),
              child: Icon(
                Icons.perm_identity,
                size: 24.0,
                color: Colors.white.withOpacity(0.7),
              ),
            ),
          Container(
            padding: const EdgeInsets.only(
              left: 12.0,
            ),
            child: Text(
              trans(context, 'selectUnit.welcome',
                  [user.name ?? trans(context, 'selectUnit.unknown')]),
              style: Fonts.satoshi(
                fontSize: 14.0,
                color: Color(0xFF3C2F2F),
              ),
            ),
          ),
          Expanded(
            child: Container(),
          ),
          Container(
            width: 46.0,
            height: 46.0,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                width: 1.5,
                color: Color(0x33857C18),
              ),
            ),
            child: IconButton(
              icon: SvgPicture.asset(
                'assets/icons/login.svg',
                color: Colors.black,
                width: 22.0,
                height: 22.0,
              ),
              onPressed: () {
                // Nav.to(DataStoreDemoScreen());
                showConfirmLogoutDialog(context, true);
              },
            ),
          ),
        ],
      ),
    );
  }
}

class SelectUnitQRCardWidget extends StatefulWidget {
  final Uri? initialUri;
  const SelectUnitQRCardWidget({this.initialUri, Key? key}) : super(key: key);

  @override
  State<SelectUnitQRCardWidget> createState() => _SelectUnitQRCardWidgetState();
}

class _SelectUnitQRCardWidgetState extends State<SelectUnitQRCardWidget> {
  @override
  void initState() {
    if (widget.initialUri != null) {
      WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
        showModal();
      });
    }
    super.initState();
  }

  void showModal() {
    showModalBottomSheet(
      context: context,
      isDismissible: true,
      // shape: RoundedRectangleBorder(
      //   borderRadius: BorderRadius.only(
      //     topLeft: Radius.circular(16.0),
      //     topRight: Radius.circular(16.0),
      //   ),
      // ),
      enableDrag: true,
      isScrollControlled: true,
      elevation: 4.0,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return QRCodeScannerWidget(
          initialUri: widget.initialUri,
          //popWhenClose: true,
          loadUnits: true,
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      highlightColor: Color(0xFF30BF60).withAlpha(128),
      hoverColor: Color(0xFF30BF60).withAlpha(128),
      onTap: () => showModal(),
      child: Container(
        width: MediaQuery.of(context).size.width,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12.0),
          border: Border.all(
            width: 1.5,
            color: Color(0xFFE7E5D0),
          ),
        ),
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.only(top: 35.0),
              child: SvgPicture.asset('assets/icons/qr-scan-orig.svg'),
            ),
            Padding(
              padding: const EdgeInsets.only(top: 25.0, bottom: 30.0),
              child: Text(
                trans('selectUnit.scanQR'),
                textAlign: TextAlign.center,
                style: Fonts.satoshi(
                  fontSize: 16.0,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF3C2F2F),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
