import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Security 

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    
    if !UserDefaults.standard.bool(forKey: "hasRunBefore") {
      clearApplicationSupportDirectory()
      clearKeychain()
      UserDefaults.standard.set(true, forKey: "hasRunBefore")
      UserDefaults.standard.synchronize()
    }

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "SmartChat",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }

  func clearApplicationSupportDirectory() {
    let fileManager = FileManager.default

    do {
      let appSupportURL = try fileManager.url(
        for: .applicationSupportDirectory,
        in: .userDomainMask,
        appropriateFor: nil,
        create: true
      )

      let contents = try fileManager.contentsOfDirectory(atPath: appSupportURL.path)

      for item in contents {
        let itemPath = appSupportURL.appendingPathComponent(item).path
        try fileManager.removeItem(atPath: itemPath)
      }
    } catch {
      print("Error clearing Application Support directory: \(error)")
    }
  }

  func clearKeychain() {
    let secItemClasses = [
      kSecClassGenericPassword,
      kSecClassInternetPassword,
      kSecClassCertificate,
      kSecClassKey,
      kSecClassIdentity
    ]

    for itemClass in secItemClasses {
      let query: [String: Any] = [kSecClass as String: itemClass]
      SecItemDelete(query as CFDictionary)
    }
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
