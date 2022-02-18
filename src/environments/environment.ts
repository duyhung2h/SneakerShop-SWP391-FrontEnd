// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import * as firebase from "firebase/compat";
import { initializeApp, getApps, getApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBbyI8wsydpZ-bNWGuvXTBCgA-73nsnLzw",
    authDomain: "sneakershopdatabase.firebaseapp.com",
    projectId: "sneakershopdatabase",
    storageBucket: "sneakershopdatabase.appspot.com",
    messagingSenderId: "466050280764",
    appId: "1:466050280764:web:de6413c6432b19bb048239",
    databaseURL: '/Product/zc1N53oYGzJn8inDes9q',
    measurementId: "G-EKSEBW1EV8"
};

export const environment = {
    production: false,
  firebase: {
    projectId: 'sneakershopdatabase',
    appId: '1:466050280764:web:de6413c6432b19bb048239',
    storageBucket: 'sneakershopdatabase.appspot.com',
    locationId: 'asia-southeast1',
    apiKey: 'AIzaSyBbyI8wsydpZ-bNWGuvXTBCgA-73nsnLzw',
    authDomain: 'sneakershopdatabase.firebaseapp.com',
    messagingSenderId: '466050280764',
    measurementId: 'G-EKSEBW1EV8',
  },
    apiUrl: "sneakershopdatabase.firebaseapp.com",
    apiKey: "AIzaSyBbyI8wsydpZ-bNWGuvXTBCgA-73nsnLzw",
    authDomain: "sneakershopdatabase.firebaseapp.com",
    databaseURL: '/Product/zc1N53oYGzJn8inDes9q',
    projectId: "sneakershopdatabase",
    storageBucket: "sneakershopdatabase.appspot.com",
    messagingSenderId: "466050280764"
};

// Initialize Firebase


export const appDeploy = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const analytics = getAnalytics(appDeploy);

