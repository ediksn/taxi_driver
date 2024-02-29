package com.micronetdominicana.appolodriver;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.marianhello.bgloc.react.BackgroundGeolocationPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; 
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import java.util.Arrays;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import java.util.List;
import com.sensors.RNSensorsPackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage; // <-- Add this line

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new KCKeepAwakePackage(),     
        new BackgroundGeolocationPackage(),
        new RNSoundPackage(),
        new NetInfoPackage(),
        new MapsPackage(),
        new RNFirebasePackage(),
        new RNFirebaseMessagingPackage(),
        new RNGestureHandlerPackage(),
        new RNFusedLocationPackage(),
        new RNFirebaseAuthPackage(),
        new RNFirebaseNotificationsPackage(),
        new PickerPackage(),
        new RNSensorsPackage(),
        new RNFirebaseDatabasePackage(),
        new RNFirebaseCrashlyticsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
