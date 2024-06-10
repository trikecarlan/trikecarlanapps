// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp, FirebaseApp, getApp } from "firebase/app";
import { Auth, getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu28mO7ELCQyaHcpbs7WuYbwAmGrn8u2c",
  authDomain: "trikecarlanapps.firebaseapp.com",
  projectId: "trikecarlanapps",
  messagingSenderId: "306794740191",
  appId: "1:306794740191:web:234a605793d88a8919ec6a",
  databaseURL: "https://trikecarlanapps-default-rtdb.asia-southeast1.firebasedatabase.app/",
  storageBucket: "gs://trikecarlanapps.appspot.com"
};

// Initialize Firebase
// export const app = initializeApp(firebaseConfig);

let app: FirebaseApp, auth: Auth;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    console.log("Error initializing app: " + error);
  }
} else {
  app = getApp();
  auth = getAuth(app);
}

export { app, auth };

// apiKey: "AIzaSyDu28mO7ELCQyaHcpbs7WuYbwAmGrn8u2c",
// authDomain: "trikecarlanapps.firebaseapp.com",
// projectId: "trikecarlanapps",
// storageBucket: "trikecarlanapps.appspot.com",
// messagingSenderId: "306794740191",
// appId: "1:306794740191:web:234a605793d88a8919ec6a",
// measurementId: "G-EELXHVRYKG"