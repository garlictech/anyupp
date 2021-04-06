import UIKit
import Flutter
import FBSDKCoreKit
import GoogleMaps

@UIApplicationMain
@available(iOS 9.0, *)
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
        // Google Maps
        GMSServices.provideAPIKey("AIzaSyBk3DCFqeMOuK2hHA0Q6b6mdyPYx22jI6A")
    
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
  
}
