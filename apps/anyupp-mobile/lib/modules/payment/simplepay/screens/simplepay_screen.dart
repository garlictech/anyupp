import 'dart:async';

import 'package:catcher/core/catcher.dart';
import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/shared/utils/deeplink_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:webview_flutter/platform_interface.dart';
import 'package:webview_flutter/webview_flutter.dart';

import 'package:fa_prev/modules/payment/simplepay/simplepay.dart';
import 'package:fa_prev/shared/nav.dart';

class SimplePayScreen extends StatefulWidget {
  final String url;
  final bool backEnabled = false;
  // final ChromeSafariBrowser browser = MyChromeSafariBrowser(MyInAppBrowser());

  SimplePayScreen({Key key, this.url}) : super(key: key);

  @override
  _SimplePayScreenState createState() => _SimplePayScreenState();
}

class _SimplePayScreenState extends State<SimplePayScreen> {
  final Completer<WebViewController> _controller = Completer<WebViewController>();

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        // print('### BACK');
        return widget.backEnabled;
      }, // BACK BUTTON DISABLED for the WebView
      child: SafeArea(
        child: Scaffold(
          backgroundColor: Colors.white,
          extendBodyBehindAppBar: true,
          body: BlocListener<SimplePayBloc, SimplePayState>(
            listener: (BuildContext context, SimplePayState state) {
              if (state is SimplePayPaymentResultState || state is SimplePayError) {
                Nav.pop();
              }
            },
            child: BlocBuilder<SimplePayBloc, SimplePayState>(builder: (context, SimplePayState state) {
              return _buildWebView(context);
            }),
          ),
        ),
      ),
    );
  }

  Widget _buildWebView(BuildContext context) {
    return WebView(
      initialUrl: widget.url,
      javascriptMode: JavascriptMode.unrestricted,
      onWebViewCreated: (WebViewController webViewController) {
        _controller.complete(webViewController);
      },
      navigationDelegate: (NavigationRequest request) {
        print('### navigationDelegate $request}');
        final Uri uri = Uri.parse(request.url);
        if (isValidTransactionBackUrl(uri)) {
          getIt<SimplePayBloc>().add(CollectSimplePayTransactionStatus(getTransactionIdFromTransactionBackUrl(uri)));
          return NavigationDecision.prevent;
        }
        return NavigationDecision.navigate;
      },
      onPageStarted: (String url) {
        print('Page started loading: $url');
      },
      onPageFinished: (String url) {
        print('Page finished loading: $url');
      },
      onWebResourceError: (WebResourceError error) {
        Catcher.reportCheckedError(error, null);
      },
      gestureNavigationEnabled: widget.backEnabled,
    );
  }
}

// class MyInAppBrowser extends InAppBrowser {
//   @override
//   Future onLoadStart(String url) async {
//     print("\n\nStarted $url\n\n");
//   }

//   @override
//   Future onLoadStop(String url) async {
//     print("\n\nStopped $url\n\n");
//   }

//   @override
//   void onLoadError(String url, int code, String message) {
//     // print("\n\nCan't load $url.. Error: $message\n\n");
//     Catcher.reportCheckedError({code: code, url: url, message: message}, null);
//   }

//   @override
//   void onExit() {
//     print("\n\nBrowser closed!\n\n");
//   }
// }

// class MyChromeSafariBrowser extends ChromeSafariBrowser {
//   MyChromeSafariBrowser(browserFallback) : super(bFallback: browserFallback);

//   @override
//   void onOpened() {
//     print("ChromeSafari browser opened");
//   }

//   @override
//   void onCompletedInitialLoad() {
//     print("ChromeSafari browser initial load completed");
//   }

//   @override
//   void onClosed() {
//     print("ChromeSafari browser closed");
//   }
// }
