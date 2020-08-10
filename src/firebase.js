
import firebase from "firebase";

const firebaseApp= firebase.initializeApp({
    apiKey: "AIzaSyCZIYG1zUda9mPE-amogekIi42Xn2tJE30",
    authDomain: "instagram-clone-react-ac6e5.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-ac6e5.firebaseio.com",
    projectId: "instagram-clone-react-ac6e5",
    storageBucket: "instagram-clone-react-ac6e5.appspot.com",
    messagingSenderId: "36579429633",
    appId: "1:36579429633:web:8c006d448e81b888ef9f00",
    measurementId: "G-QCFMMQ757J"
  });
  

  const db= firebaseApp.firestore();
  const auth = firebase.auth();
  const storage=firebase.storage();

  export {db, auth, storage};

  