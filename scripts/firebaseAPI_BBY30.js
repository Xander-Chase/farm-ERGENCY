//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
  apiKey: "AIzaSyCTRNDtpYvuUP8x482zqMJFT3-dYlDwygc",
  authDomain: "bby30-7bf9a.firebaseapp.com",
  projectId: "bby30-7bf9a",
  storageBucket: "bby30-7bf9a.appspot.com",
  messagingSenderId: "242805119834",
  appId: "1:242805119834:web:a91d628254feb99645f163",
  measurementId: "G-SMSD3W342N"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
