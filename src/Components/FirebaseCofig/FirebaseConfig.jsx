import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWNOtn_zO3ekheuPOBlw7EsieLjYtEguw",
  authDomain: "spotsball-b7d59.firebaseapp.com",
  projectId: "spotsball-b7d59",
  storageBucket: "spotsball-b7d59.appspot.com",
  messagingSenderId: "867478972439",
  appId: "1:867478972439:web:0e4e7d044dfb71b5021452",
  measurementId: "G-02P8264H1C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };
