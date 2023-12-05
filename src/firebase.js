// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: "AIzaSyDOiKTl3Vlyre_bG4kojDkq48NAJM1s3jk",
  // authDomain: "fir-oakland.firebaseapp.com",
  // projectId: "fir-oakland",
  // storageBucket: "fir-oakland.appspot.com",
  // messagingSenderId: "825978077621",
  // appId: "1:825978077621:web:07ba421d2852b5150e59fc",
  // measurementId: "G-9BP9C0N7Y6"
  apiKey: "AIzaSyB6HXShf7udGKWiAmyX2IAu3L5_cC-OQdI",
  authDomain: "test-db-8cb90.firebaseapp.com",
  projectId: "test-db-8cb90",
  storageBucket: "test-db-8cb90.appspot.com",
  messagingSenderId: "169308840747",
  appId: "1:169308840747:web:898c36abb45b720acd5b6e",
};
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBehoHlTO2zcfO8R8eZDJ1Ju3nJZX82r9Y",
//   authDomain: "infosync-oakland-portal.firebaseapp.com",
//   projectId: "infosync-oakland-portal",
//   storageBucket: "infosync-oakland-portal.appspot.com",
//   messagingSenderId: "868103457113",
//   appId: "1:868103457113:web:73de1ec4b05510e5abe448",
//   measurementId: "G-MRH4T1GPDC"
// };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
let secondaryApp = initializeApp(firebaseConfig, "secondary");
const auth = getAuth();

// initilize Firestore
const firestore = getFirestore();
// collection ref
// const colRef = collection(db, "users");
// // get collection data
// getDocs(colRef)
//   .then((snapshot) => {
//     let items = [];
//     snapshot.docs.forEach((doc) => {
//       items.push({ ...doc.data(), id: doc.id });
//       console.log(items);
//       console.log(items[1].userName);
//     });
//     // console.log(items)
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

export { app, auth, firestore, secondaryApp };
