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
        let email: String? = params.value(forKey: "email") as! String?
        let appData: [String: String] = params.value(forKey: "appData") as! [String: String]? ?? [:]
        let data: [String: String] = params.value(forKey: "data") as! [String: String]? ?? [:]
        let jwt: String? = params.value(forKey: "jwt") as! String?
        extole = ExtoleImpl(programDomain: "https://" + (programDomain as String), applicationName: appName,
          personIdentifier: email, applicationData: appData, data: data, labels: labels, sandbox: sandbox,
          listenToEvents: true, disabledActions: [ActionType.PROMPT, ActionType.VIEW_FULLSCREEN], jwt: jwt)
        resolve(true)
    }

    @objc(sendEvent:withData:withResolver:withRejecter:)
    func sendEvent(eventName: NSString, data: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        extole?.sendEvent(eventName as String, (data as! [String: String]?) ?? [:]) { [self] (idEvent, error) in
            if error != nil {
                self.extole?.getLogger().error(error?.localizedDescription ?? "Unable to load Extole Zone")
                reject("send_event_failed", error?.localizedDescription ?? "Unable to load Extole Zone", error)
            } else {
                resolve(idEvent?.getValue())
            }
        }
    }

    @objc(identify:withData:withResolver:withRejecter:)
    func identify(email: NSString, data: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        extole?.identify(email as String, (data as! [String: String]?) ?? [:]) { [self] (idEvent, error) in
            if error != nil {
                self.extole?.getLogger().error(error?.localizedDescription ?? "Unable to send identify event")
                reject("identify_failed", error?.localizedDescription ?? "Unable to send identify event", error)
            } else {
                resolve(idEvent?.getValue())
            }
        }
    }

    @objc(identifyJwt:withData:withResolver:withRejecter:)
    func identify(jwt: NSString, data: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        extole?.identifyJwt(jwt as String, (data as! [String: String]?) ?? [:]) { [self] (idEvent, error) in
            if error != nil {
                self.extole?.getLogger().error(error?.localizedDescription ?? "Unable to send identify event")
                reject("identify_failed", error?.localizedDescription ?? "Unable to send identify event", error)
            } else {
                resolve(idEvent?.getValue())
            }
        }
    }

    @objc(fetchZone:withData:withResolver:withRejecter:)
    func fetchZone(zoneName: NSString, data: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        extole?.fetchZone(zoneName as String, (data as! [String: String]?) ?? [:]) { (zone: Zone?, campaign: Campaign?, error: Error?) in
            if error != nil {
                self.extole?.getLogger().error(error?.localizedDescription ?? "Unable to load Extole Zone")
                reject("fetch_failed", error?.localizedDescription ?? "Unable to load Extole Zone", error)
            } else {
                let encoder = JSONEncoder()
                var rawContent: [String: String] = [:]
                let jsonData = try? encoder.encode(zone?.content)
                if let data = jsonData {
                    rawContent["zone"] = String(data: data, encoding: .utf8)
                }
                rawContent["campaign_id"] = campaign?.getId().getValue()
                rawContent["program_label"] = campaign?.getProgram()
                resolve(rawContent)
            }
        }
    }

    @objc(debug:withResolver:withRejecter:)
    func debug(message: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        extole?.getLogger().debug(message as String)
    }

    @objc(info:withResolver:withRejecter:)
    func info(message: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        extole?.getLogger().info(message as String)
    }

    @objc(warn:withResolver:withRejecter:)
    func warn(message: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        extole?.getLogger().warn(message as String)
    }

    @objc(error:withResolver:withRejecter:)
    func error(message: NSString, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        extole?.getLogger().error(message as String)
    }

    @objc(logout:withRejecter:)
    func logout(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        extole?.logout()
    }

    @objc(getJsonConfiguration:withRejecter:)
    func getJsonConfiguration(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve(extole?.getJsonConfiguration())
    }

    @objc(getAccessToken:withRejecter:)
    func getAccessToken(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve(extole?.getAccessToken())
    }
}
