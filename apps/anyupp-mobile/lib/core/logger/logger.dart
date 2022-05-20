import 'package:logger/logger.dart';

import 'log_viewer/log_viewer.dart';

class LogScreenOutput extends LogOutput {
  @override
  void output(OutputEvent event) {
    LogConsole.output(event);
  }
}

var log = Logger(
  printer: SimplePrinter(
    printTime: true,
    colors: true,
  ),
  output: LogScreenOutput(),
);
