import UIKit
import Flutter
import GoogleMaps

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool 
  {
    // Google Maps
    GMSServices.provideAPIKey("AIzaSyBk3DCFqeMOuK2hHA0Q6b6mdyPYx22jI6A")

 //   if #available(iOS 10.0, *) {
 //     UNUserNotificationCenter.current().delegate = self as UNUserNotificationCenterDelegate
 //   }
   
//    Messaging.messaging().apnsToken = deviceToken
//    super.application(application, didRegisterForRemoteNotificationsWithDeviceToken: deviceToken)
    
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
