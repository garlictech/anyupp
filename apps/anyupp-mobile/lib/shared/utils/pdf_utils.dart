import 'dart:convert';
import 'dart:io';

import 'package:open_file/open_file.dart';
import 'package:path_provider/path_provider.dart';

createAndOpenPdf(String? baseString) async {
  if (baseString != null) {
    var bytes = base64Decode(baseString.replaceAll('\n', ''));
    final output = await getTemporaryDirectory();
    final file = File("${output.path}/temp.pdf");
    await file.writeAsBytes(bytes.buffer.asUint8List());
    await OpenFile.open("${output.path}/temp.pdf");
  }
}
