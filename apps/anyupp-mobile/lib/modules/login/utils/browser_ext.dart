import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import '/core/core.dart';

class ChromeSafariBrowserExt extends ChromeSafariBrowser {
  final Function? whenClosed;
  final bool? closeWhenLoaded;

  ChromeSafariBrowserExt({this.whenClosed, this.closeWhenLoaded = false})
      : super();

  @override
  void onOpened() {
    log.d("ChromeSafari browser opened");
    super.onOpened();
  }

  @override
  void onCompletedInitialLoad() {
    log.d("ChromeSafari browser initial load completed");
    super.onCompletedInitialLoad();
    if (closeWhenLoaded == true) {
      // this.close();
      Future.delayed(Duration(seconds: 1)).then((value) => this.close());
    }
  }

  @override
  void onClosed() {
    log.d("ChromeSafari browser closed");
    super.onClosed();
    if (whenClosed != null) {
      whenClosed!();
    }
  }
}
