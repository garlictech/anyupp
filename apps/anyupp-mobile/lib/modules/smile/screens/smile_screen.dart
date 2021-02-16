import 'package:animated_background/animated_background.dart';
import 'package:camera/camera.dart';
import 'package:fa_prev/shared/face.dart';
import 'package:firebase_ml_vision/firebase_ml_vision.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import 'smile_bad_day_screen.dart';
import 'smile_success_screen.dart';

class SmileScreen extends StatefulWidget {
  @override
  _SmileScreenState createState() => _SmileScreenState();
}

class _SmileScreenState extends State<SmileScreen> with TickerProviderStateMixin {

  final FaceDetector faceDetector = FirebaseVision.instance.faceDetector(
    
    FaceDetectorOptions(
        enableTracking: true,
        mode: FaceDetectorMode.accurate,
        enableLandmarks: true,
        enableClassification: true,
        enableContours: true));

  CameraController _camera;
  CameraLensDirection _direction = CameraLensDirection.front;
  bool _isDetecting = false;
  List<Face> faces = [];

  var particlePaint = Paint()
    ..style = PaintingStyle.stroke
    ..strokeWidth = 1.0;

  final EmotionHandler _emotionHandler = EmotionHandler();
  bool _isRunning = false;
  bool _playAnimation = false;
  FaceEmotion _emotion;

  @override
  void initState() {
    super.initState();
    _initializeCamera();
  }

  @override
  void dispose() {
    _stopDetection();
    super.dispose();
  }

  void _stopDetection() {
    faceDetector.close();
    if (_camera != null) {
      _camera.dispose();
    }
  }

  Behaviour _buildBehaviour() {
    ParticleOptions options = _emotion == FaceEmotion.SAD ? particleOptionsSad : particleOptionsHappy;
    bool reverse = _emotion == FaceEmotion.SAD;
    return RainParticleBehaviour(
        options: options, paint: particlePaint, enabled: true, reverse: reverse);
  }

  Future<void> _initializeCamera() async {
    CameraDescription description = await getCamera(_direction);
    ImageRotation rotation = rotationIntToImageRotation(
      description.sensorOrientation,
    );

    _camera = CameraController(
      description,
      defaultTargetPlatform == TargetPlatform.iOS
          ? ResolutionPreset.low
          : ResolutionPreset.medium,
      enableAudio: false,
    );
    await _camera.initialize();
    _isRunning = true;

    _camera.startImageStream((CameraImage image) {
      if (!mounted || _isDetecting || !_isRunning) return;

      _isDetecting = true;

      detect(image, faceDetector.processImage, rotation).then(
        (List<Face> faces) {
          _emotionHandler.tickEmotion(faces);

          if (_emotionHandler.dirty) {
            setState(() {
              _playAnimation = _emotionHandler.playAnimation;
              _emotion = _emotionHandler.emotion;
              print('************************ _emotion=$_emotion');
              print('************************ _playAnimation=$_playAnimation');
              if (_emotionHandler.emotion == FaceEmotion.SMILING && _emotionHandler.finished == true) {
                _isRunning = false;
                _stopDetection();
                Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => SmileSuccessScreen()));
              }
              if (_emotionHandler.emotion == FaceEmotion.SAD && _emotionHandler.finished == true) {
                _isRunning = false;
                _stopDetection();
                Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => BadDayScreen()));
              }
            });
          }
          _isDetecting = false;
        },
      ).catchError(
        (_) {
          _isDetecting = false;
        },
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        body: _playAnimation ? AnimatedBackground(
          behaviour: _buildBehaviour(),
          vsync: this,
          child: _buildPage(),
        ) : _buildPage()
      ),
    );
  }

  Widget _buildPage() {
    return Container(
        child: Column(
      mainAxisAlignment: MainAxisAlignment.start,
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.only(top: 66.0, bottom: 66.0),
          child: SvgPicture.asset(
            'assets/icons/ico-smile_hand_drawn.svg',
            width: 100,
          ),
        ),
        // Text(
        //   _smilingTimer > 0 ? ((DateTime.now().millisecondsSinceEpoch - _smilingTimer)).toString() : 'NO'
        // ),
        _getText('All we need is a', Color(0xFF373737)),
        GestureDetector(
          onTap: () {
            print('SMILE BUTTON TAPPED');
            setState(() {
              _playAnimation = !_playAnimation;
            });
          },
          child: Container(
              color: Color(0xFF30bf60),
              padding: EdgeInsets.only(top: 8, left: 80, right: 80),
              child: _getText('SMILE', Colors.white)),
        ),
        _getText('to get started. =)', Color(0xFF373737)),
        Padding(
          padding: const EdgeInsets.only(left: 72, right: 72, top: 40),
          child: Text(
            'Although you are not signed in, we will do our best to give you',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: 'Intro',
              fontSize: 18,
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(top: 24),
          child: Text(
            'personalized experience',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.w400),
          ),
        )
      ],
    ));
  }

  Widget _getText(String text, Color color) {
    return Text(
      text,
      style: TextStyle(fontFamily: 'ZoojaPro', fontSize: 55, color: color),
    );
  }
}
