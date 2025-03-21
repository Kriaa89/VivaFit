import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDwJ-UuZa4UJG1qxfEuWWr_2lIcfCZaHhE",
  authDomain: "vivafit-e33ef.firebaseapp.com",
  projectId: "vivafit-e33ef",
  storageBucket: "vivafit-e33ef.appspot.com",
  messagingSenderId: "207950991711",
  appId: "1:207950991711:web:9ba2511fbc7af54e70af95"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app;
