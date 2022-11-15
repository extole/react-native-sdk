import Foundation
import ExtoleMobileSDK
import SwiftUI

@objc(ExtoleMobileSdk)
class ExtoleMobileSdk: NSObject {
    @Published var extole: ExtoleImpl?

    @objc(init:withParams:withResolver:withRejecter:)
    func initExtole(programDomain: NSString, params: NSDictionary, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let labels: [String] = params.value(forKey: "labels") as! [String]? ?? []
        let sandbox = params.value(forKey: "sandbox") as! String? ?? String("production-production")
        let appName = params.value(forKey: "appName") as! String? ?? String("react-native-\(programDomain)")
        let email:String? = params.value(forKey: "email") as! String?
        let appData:[String:String] = params.value(forKey: "appData") as! [String: String]? ?? [:]
        let data:[String:String] = params.value(forKey: "data") as! [String: String]? ?? [:]
        extole = ExtoleImpl(programDomain: "https://" + (programDomain as String), applicationName: appName, personIdentifier: email, applicationData: appData, data: data, labels: labels, sandbox: sandbox, listenToEvents: false)
    }

    @objc(sendEvent:withData:withResolver:withRejecter:)
    func sendEvent(eventName: NSString, data: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        extole?.sendEvent(eventName as String, (data as! [String: String]?) ?? [:]) { [self] (idEvent: Id<Event>?, error: Error?) in
            if error != nil {
                self.extole?.getLogger().error(error?.localizedDescription ?? "Unable to load Extole Zone")
                reject("send_event_failed", error?.localizedDescription ?? "Unable to load Extole Zone", error)
            } else {
                resolve(idEvent?.getValue())
            }
        }
    }

    @objc(fetchZone:withData:withResolver:withRejecter:)
    func fetchZone(zoneName: NSString, data: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        extole?.fetchZone(zoneName as String, (data as! [String: String]?) ?? [:]) { (zone: Zone?, _: Campaign?, error: Error?) in
            if error != nil {
                self.extole?.getLogger().error(error?.localizedDescription ?? "Unable to load Extole Zone")
                reject("fetch_failed", error?.localizedDescription ?? "Unable to load Extole Zone", error)
            } else {
                let encoder = JSONEncoder()
                let jsonData = try? encoder.encode(zone?.content)
                if let data = jsonData {
                    resolve(String(data: data, encoding: .utf8))
                }
            }
        }
    }

    @objc(getJsonConfiguration:withRejecter:)
    func getJsonConfiguration(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve(extole?.getJsonConfiguration())
    }
}
