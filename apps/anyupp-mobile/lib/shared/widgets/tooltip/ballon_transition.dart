part of tooltip;

class _BalloonTransition extends StatefulWidget {
  final Widget child;
  final Duration duration;
  final TooltipDirection tooltipDirection;
  final bool hide;
  final Function(AnimationStatus)? animationEnd;

  _BalloonTransition({
    Key? key,
    required this.child,
    required this.duration,
    required this.tooltipDirection,
    this.hide = false,
    this.animationEnd,
  }) : super(key: key);

  @override
  _BalloonTransitionState createState() => _BalloonTransitionState();
}

class _BalloonTransitionState extends State<_BalloonTransition>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _rotationAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: widget.duration,
    );
    final CurvedAnimation curvedAnimation = CurvedAnimation(
      curve: Curves.easeInOut,
      parent: _animationController,
    );
    _rotationAnimation = Tween<double>(begin: 0, end: 1).animate(
      curvedAnimation,
    );
    if (!widget.hide) {
      _animationController.forward();
    } else {
      _animationController.reverse();
    }
    _animationController.addStatusListener((status) {
      if ((status == AnimationStatus.completed ||
              status == AnimationStatus.dismissed) &&
          widget.animationEnd != null) {
        widget.animationEnd!(status);
      }
    });
  }

  @override
  void didUpdateWidget(_BalloonTransition oldWidget) {
    if (widget.hide) {
      _animationController.reverse();
    }
    super.didUpdateWidget(oldWidget);
  }

  @override
  Widget build(BuildContext context) {
    return _OpacityAnimationWrapper(
      duration: widget.duration,
      child: AnimatedBuilder(
        animation: _rotationAnimation,
        builder: (context, _) {
          // log.d(_rotationAnimation.value);
          // _BallonTransformation _ballonTransformation =
          //     _BallonTransformation.forAnimationValue(
          //   _rotationAnimation.value,
          //   widget.tooltipDirection,
          // );
          // return Transform(
          //   child: widget.child,
          //   // transform: Matrix4.identity()..setEntry(1, 2, _rotationAnimation.value),
          //   alignment: _ballonTransformation.alignment,
          //   transform: _ballonTransformation.transformation,
          // );
          return Opacity(
            opacity: _rotationAnimation.value,
            child: widget.child,
          );
        },
      ),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }
}

class _OpacityAnimationWrapper extends StatefulWidget {
  final Duration duration;
  const _OpacityAnimationWrapper({
    Key? key,
    required this.child,
    required this.duration,
  }) : super(key: key);

  final Widget child;

  @override
  __OpacityAnimationWrapperState createState() =>
      __OpacityAnimationWrapperState();
}

class __OpacityAnimationWrapperState extends State<_OpacityAnimationWrapper> {
  double _opacity = 0.38;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      if (mounted) {
        setState(() {
          _opacity = 1;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedOpacity(
      duration: widget.duration,
      opacity: _opacity,
      child: widget.child,
    );
  }
}
