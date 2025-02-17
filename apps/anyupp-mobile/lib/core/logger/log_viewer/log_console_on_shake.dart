part of log_viewer;

class LogConsoleOnShake extends StatefulWidget {
  final Widget child;
  final bool dark;
  final bool debugOnly;
  final bool enabled;

  const LogConsoleOnShake({
    Key? key,
    required this.child,
    this.dark = false,
    this.debugOnly = true,
    this.enabled = false,
  }) : super(key: key);

  @override
  _LogConsoleOnShakeState createState() => _LogConsoleOnShakeState();
}

class _LogConsoleOnShakeState extends State<LogConsoleOnShake> {
  late ShakeDetector _detector;
  bool _open = false;

  @override
  void initState() {
    super.initState();

    if (widget.debugOnly) {
      assert(() {
        _init();
        return true;
      }());
    } else {
      _init();
    }
  }

  @override
  Widget build(BuildContext context) {
    return widget.child;
  }

  _init() {
    if (widget.enabled) {
      _detector = ShakeDetector(onPhoneShake: _openLogConsole);
      _detector.startListening();
    }
  }

  _openLogConsole() async {
    if (_open) return;

    _open = true;
    await LogConsole.open(context, dark: widget.dark);
    _open = false;
  }

  @override
  void dispose() {
    if (widget.enabled) {
      _detector.stopListening();
    }
    super.dispose();
  }
}
