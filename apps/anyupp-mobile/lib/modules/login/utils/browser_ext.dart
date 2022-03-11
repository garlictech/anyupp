import 'package:flutter_inappwebview/flutter_inappwebview.dart';

class ChromeSafariBrowserExt extends ChromeSafariBrowser {
  final Function? whenClosed;
  final bool? closeWhenLoaded;

  ChromeSafariBrowserExt({this.whenClosed, this.closeWhenLoaded = false})
      : super();

  @override
  void onOpened() {
    print("ChromeSafari browser opened");
    super.onOpened();
  }

  @override
  void onCompletedInitialLoad() {
    print("ChromeSafari browser initial load completed");
    super.onCompletedInitialLoad();
    if (closeWhenLoaded == true) {
      // this.close();
      Future.delayed(Duration(seconds: 1)).then((value) => this.close());
    }
  }

  @override
  void onClosed() {
    print("ChromeSafari browser closed");
    super.onClosed();
    if (whenClosed != null) {
      whenClosed!();
    }
  }
}
