import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyDgX-2znheWVVzS-tIt_IS6xuEXXzskoZo",
    authDomain: "slack-chat-1dbd6.firebaseapp.com",
    projectId: "slack-chat-1dbd6",
    storageBucket: "slack-chat-1dbd6.appspot.com",
    messagingSenderId: "545133727860",
    appId: "1:545133727860:web:836eae134cd3be369e4121",
    measurementId: "G-0JNCHWT08E"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;