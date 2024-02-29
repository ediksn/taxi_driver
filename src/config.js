import firebase from 'react-native-firebase';
let config = {  
  apiKey: 'AIzaSyBRpCCElS01eGX097g5r66aCbGf65piKCA',
  authDomain: 'apolo-taxi-547f9.firebaseapp.com',
  databaseURL: 'https://apolo-taxi-547f9.firebaseio.com',
  projectId: 'apolo-taxi-547f9',
  storageBucket: 'apolo-taxi-547f9.appspot.com',
  messagingSenderId: '133377262328'
};
let app = firebase.initializeApp(config);  
export const db = app.database();  