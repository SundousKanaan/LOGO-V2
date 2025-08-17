package com.capisoft.logo;
import com.getcapacitor.BridgeActivity;

import android.os.Bundle;
import com.getcapacitor.Plugin;

import java.util.ArrayList;
import java.util.List;

import com.google.firebase.FirebaseApp;


public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // No manual plugin registration typically needed with Capacitor 4/5+
    FirebaseApp.initializeApp(this);    
  }
}
