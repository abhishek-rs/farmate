import * as firebase from 'firebase'

var config = {
    apiKey: "AIzaSyDbWlGG-aqzoePURjVEbAWeOVjXrqNXI_I",
    authDomain: "farmate-f4c81.firebaseapp.com",
    databaseURL: "https://farmate-f4c81.firebaseio.com",
    projectId: "farmate-f4c81",
    storageBucket: "farmate-f4c81.appspot.com",
    messagingSenderId: "48710733747"
  };
  firebase.initializeApp(config);

export const usersRef = firebase.database().ref('users');
export const dataRef = firebase.database().ref('main');
export const database = firebase.database();
export const firebaseAuth = firebase.auth;