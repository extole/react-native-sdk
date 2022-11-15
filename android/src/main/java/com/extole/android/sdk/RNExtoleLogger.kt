package com.extole.android.sdk

import com.facebook.react.bridge.ReactMethod

class RNExtoleLogger(val logger: ExtoleLogger) {

    @ReactMethod
    fun debug(message: String, vararg args: Any?) {
        logger.debug(message, args)
    }

    @ReactMethod
    fun error(message: String, vararg args: Any?) {
        logger.error(message, args)
    }

    @ReactMethod
    fun error(exception: Throwable, message: String, vararg args: Any?) {
        logger.error(exception, message, args)
    }

    @ReactMethod
    fun getLogLevel(): String {
        return logger.getLogLevel().name
    }

    @ReactMethod
    fun info(message: String, vararg args: Any?) {
        logger.info(message, args)
    }

    @ReactMethod
    fun warn(message: String, vararg args: Any?) {
        logger.warn(message, args)
    }
}
