import 'package:camera/camera.dart';
import 'package:fa_prev/shared/face.dart';
import 'package:flutter/foundation.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:tflite/tflite.dart';

typedef OnDetection = void Function(List<dynamic> recognitions);

class FaceRepository {
  CameraController _camera;
  CameraLensDirection _direction = CameraLensDirection.front;

  bool _isBusy = false;
  bool _isDetectionRunning = false;
  bool _modelLoaded = false;
  int _lastRecognitionTime = 0;

  bool get isModelLoaded => _modelLoaded;
  bool get isDetectionRunning => _isDetectionRunning;

  Future<void> _initializeCamera() async {
    // print('**** FaceSercvice._initializeCamera()');
    CameraDescription description = await getCamera(_direction);
    _camera = CameraController(
      description,
      defaultTargetPlatform == TargetPlatform.iOS ? ResolutionPreset.low : ResolutionPreset.low,
      enableAudio: false
    );
    await _camera.initialize();
    _isBusy = false;
  }

  Future<void> _initWithModel(String modelPath, String labelPath) async {
    // print('**** FaceSercvice._initWithModel()');
    _modelLoaded = false;
    String response = await Tflite.loadModel(
      model: modelPath,
      labels: labelPath,
    );
    print('FaceSercvice._initWithModel().loaded()=$response');
    _modelLoaded = true;
  }

  Future<void> startDetection(
      {String modelPath, String labelPath, int snapshotIntervallMs = 1000, OnDetection onDetection}) async {
    print('**** FaceSercvice.startDetection()');
    if (await Permission.camera.isPermanentlyDenied) {
      print('**** FaceSercvice.startDetection().camera permanent denied. End face recognition...');
      return;
    }
    await _initWithModel(modelPath, labelPath);
    await _initializeCamera();
    _isDetectionRunning = true;
    await _camera.startImageStream((CameraImage image) {
      if (_isBusy) return;
      if (_lastRecognitionTime <= DateTime.now().millisecondsSinceEpoch - snapshotIntervallMs) {
        _isBusy = true;
        _lastRecognitionTime = DateTime.now().millisecondsSinceEpoch;
        recognizeImageOnStream(image).then((recognitions) {
          // print('**** FaceSercvice.recognizeImageOnStream.results=$recognitions');
          onDetection(recognitions);
          _isBusy = false;
        });
      }
    });
  }

  Future<void> stopDetection() async {
    print('**** FaceSercvice.stopDetection()._isDetectionRunning=$_isDetectionRunning');
    try {
      if (_camera != null) {
        if (_isDetectionRunning) {
          print('**** FaceSercvice.stopDetection().stopImageStream()');
          await _camera.stopImageStream();
        }
        print('**** FaceSercvice.stopDetection().dispose()');
        await _camera.dispose();
        _camera = null;
      }
    } finally {
      _isDetectionRunning = false;
    }
  }

  Future<void> dispose() async {
      // print('**** FaceSercvice.stopDetection().Tflite.close()');
      // await Tflite.close();
      // print('**** FaceSercvice.stopDetection().Tflite.closed()');
  }

  Future<List<dynamic>> recognizeImageOnStream(CameraImage image) async {
    _lastRecognitionTime = DateTime.now().millisecondsSinceEpoch;

    // print('**** FaceSercvice.recognizeImageOnStream().image[${image.width},${image.height}]');
    List<dynamic> recognitions = await Tflite.runModelOnFrame(
      bytesList: image.planes.map((plane) {
        return plane.bytes;
      }).toList(),
      imageHeight: image.height,
      imageWidth: image.width,
      numResults: 3,
      // rotation: 90,
      // numResults: 10
    );
    // print('**** FaceSercvice.recognizeImageOnStream()=$recognitions');
    return recognitions;
  }
}
