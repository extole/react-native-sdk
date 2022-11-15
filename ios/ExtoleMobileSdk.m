#import <React/RCTBridgeModule.h>
#import <Foundation/Foundation.h>
#import "React/RCTViewManager.h"
#import "React/RCTComponentEvent.h"
#import <React/RCTViewManager.h>
#import <MapKit/MapKit.h>

@interface RCT_EXTERN_MODULE(ExtoleMobileSdk, NSObject)

RCT_EXTERN_METHOD(init:(NSString *)programDomain withParams:(NSDictionary *)params
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(sendEvent:(NSString *)eventName withData:(NSDictionary *)data
        withResolver:(RCTPromiseResolveBlock)resolve
        withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchZone:(NSString *)zoneName withData:(NSDictionary *)data
        withResolver:(RCTPromiseResolveBlock)resolve
        withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getJsonConfiguration:(RCTPromiseResolveBlock)resolve
        withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(extoleView:(RCTPromiseResolveBlock)resolve
        withRejecter:(RCTPromiseRejectBlock)reject)


+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
