package com.extole.android.sdk

import android.util.Log
import com.extole.android.sdk.impl.ApplicationContext
import com.extole.android.sdk.impl.ExtoleImpl
import com.extole.android.sdk.impl.ExtoleInternal
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject


class RNExtole(reactContext: ReactApplicationContext?) :
    ReactContextBaseJavaModule(reactContext) {

    @Volatile
    private lateinit var extole: ExtoleInternal

    @ReactMethod
    fun init(
        programDomain: String,
        parameters: ReadableMap
    ) {
        val labelsSet: Set<String> =
            parameters.getArray("labels")?.toArrayList()?.map { it.toString() }?.toSet()
                ?: emptySet()
        val appHeadersMap: Map<String, String> =
            parameters.getMap("appHeaders")?.toHashMap()?.mapValues { it.toString() } ?: emptyMap()
        val appDataMap: Map<String, String> =
            parameters.getMap("appData")?.toHashMap()?.mapValues { it.toString() } ?: emptyMap()
        val dataMap: Map<String, String> =
            parameters.getMap("data")?.toHashMap()?.mapValues { it.toString() } ?: emptyMap()
        val sandbox: String = parameters.getString("sandobx") ?: "prod-prod"
        val appName: String = parameters.getString("appName") ?: "Extole $programDomain"
        val email: String? = parameters.getString("email")
        val listenToEvents: Boolean =
            if (parameters.hasKey("listenToEvents")) parameters.getBoolean("listenToEvents") else true
        if (!this::extole.isInitialized) {
            synchronized(this) {
                val additionaProtocolHandler = listOf<ProtocolHandler>()

                if (!this::extole.isInitialized) {
                    Log.d("Extole", "Extole React initialized")
                    extole = ExtoleImpl(
                        programDomain,
                        appName,
                        sandbox,
                        ApplicationContext(reactApplicationContext.baseContext, null),
                        labelsSet,
                        dataMap,
                        appDataMap.toMutableMap(),
                        appHeadersMap.toMutableMap(),
                        email,
                        listenToEvents,
                        additionaProtocolHandler,
                        null,
                        disabledActions = setOf(
                            Action.ActionType.VIEW_FULLSCREEN,
                            Action.ActionType.PROMPT
                        )
                    )
                }
            }
        }
    }

    @ReactMethod
    fun sendEvent(eventName: String, data: ReadableMap, promise: Promise) {
        executeWithPromise(promise) {
            return@executeWithPromise extole.sendEvent(eventName,
                data.toHashMap().mapValues { it.toString() }).id
        }
    }

    @ReactMethod
    fun getLogger(): RNExtoleLogger {
        return RNExtoleLogger(extole.getLogger())
    }

    @ReactMethod
    fun fetchZone(zoneName: String, data: ReadableMap, promise: Promise) {
        executeWithPromise(promise) {
            val response = extole.fetchZone(zoneName,
                data.toHashMap().mapValues { it.toString() });
            val campaignId = response.second.getId().id
            val programLabel = response.second.getProgramLabel()
            val content = response.first.content ?: emptyMap()
            val allContent = mutableMapOf<String, Any?>()
            allContent.putAll(content)
            allContent.put("program_label", programLabel)
            allContent.put("campaign_id", campaignId)
            return@executeWithPromise convertJsonToMap(JSONObject(content))
        }
    }

    @ReactMethod
    fun identify(email: String, data: ReadableMap, promise: Promise) {
        executeWithPromise(promise) {
            return@executeWithPromise extole.identify(
                email, data.toHashMap().mapValues { it.toString() }).id
        }
    }

    @ReactMethod
    fun getJsonConfiguration(promise: Promise) {
        promise.resolve(JSONArray(extole.getJsonConfiguration()).toString())
    }

    @Suppress("TooGenericExceptionCaught")
    private fun <T> executeWithPromise(
        promise: Promise,
        closure: suspend () -> T?
    ) {
        GlobalScope.launch {
            try {
                promise.resolve(closure())
            } catch (e: RuntimeException) {
                Log.e("Extole", "Exception " + e.stackTraceToString())
                promise.reject("failed to send event", e)
            }
        }
    }

    override fun getName(): String {
        return "ExtoleMobileSdk"
    }

    companion object {
        fun convertJsonToMap(jsonObject: JSONObject): WritableMap? {
            val map: WritableMap = WritableNativeMap()
            val iterator: Iterator<String> = jsonObject.keys()
            while (iterator.hasNext()) {
                val key = iterator.next()
                val value: Any = jsonObject.get(key)
                if (value is JSONObject) {
                    map.putMap(key, convertJsonToMap(value as JSONObject))
                } else if (value is JSONArray) {
                    map.putArray(key, convertJsonToArray(value as JSONArray))
                } else if (value is Boolean) {
                    map.putBoolean(key, value)
                } else if (value is Int) {
                    map.putInt(key, value)
                } else if (value is Double) {
                    map.putDouble(key, value)
                } else if (value is String) {
                    map.putString(key, value)
                } else {
                    map.putString(key, value.toString())
                }
            }
            return map
        }

        fun convertJsonToArray(jsonArray: JSONArray): WritableArray? {
            val array: WritableArray = WritableNativeArray()
            for (i in 0 until jsonArray.length()) {
                val value: Any = jsonArray.get(i)
                if (value is JSONObject) {
                    array.pushMap(convertJsonToMap(value as JSONObject))
                } else if (value is JSONArray) {
                    array.pushArray(convertJsonToArray(value as JSONArray))
                } else if (value is Boolean) {
                    array.pushBoolean(value)
                } else if (value is Int) {
                    array.pushInt(value)
                } else if (value is Double) {
                    array.pushDouble(value)
                } else if (value is String) {
                    array.pushString(value)
                } else {
                    array.pushString(value.toString())
                }
            }
            return array
        }

        fun convertMapToJson(readableMap: ReadableMap?): JSONObject? {
            val jsonObject = JSONObject()
            val iterator = readableMap!!.keySetIterator()
            while (iterator.hasNextKey()) {
                val key = iterator.nextKey()
                when (readableMap.getType(key)) {
                    ReadableType.Null -> jsonObject.put(key, JSONObject.NULL)
                    ReadableType.Boolean -> jsonObject.put(key, readableMap.getBoolean(key))
                    ReadableType.Number -> jsonObject.put(key, readableMap.getDouble(key))
                    ReadableType.String -> jsonObject.put(key, readableMap.getString(key))
                    ReadableType.Map -> jsonObject.put(key, convertMapToJson(readableMap.getMap(key)))
                    ReadableType.Array -> jsonObject.put(
                        key,
                        convertArrayToJson(readableMap.getArray(key))
                    )
                }
            }
            return jsonObject
        }

        fun convertArrayToJson(readableArray: ReadableArray?): JSONArray? {
            val array = JSONArray()
            for (i in 0 until readableArray!!.size()) {
                when (readableArray.getType(i)) {
                    ReadableType.Null -> {
                    }
                    ReadableType.Boolean -> array.put(readableArray.getBoolean(i))
                    ReadableType.Number -> array.put(readableArray.getDouble(i))
                    ReadableType.String -> array.put(readableArray.getString(i))
                    ReadableType.Map -> array.put(convertMapToJson(readableArray.getMap(i)))
                    ReadableType.Array -> array.put(convertArrayToJson(readableArray.getArray(i)))
                }
            }
            return array
        }
    }
}
