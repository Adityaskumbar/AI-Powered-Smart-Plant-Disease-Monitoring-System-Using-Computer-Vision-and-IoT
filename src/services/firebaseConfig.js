// src/services/firebaseConfig.js
// TODO: Run \`npm install firebase\` before using this file!
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxLvFEEc1ZCriN3k_gyAnbOG6LZ_NWIVw",
  authDomain: "plantguard-2d20f.firebaseapp.com",
  projectId: "plantguard-2d20f",
  storageBucket: "plantguard-2d20f.firebasestorage.app",
  messagingSenderId: "941513167385",
  appId: "1:941513167385:web:2e8da8748d041df53dd088",
  measurementId: "G-76VZ63BY4C"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);
export const db = getFirestore(app);

/** 
 * Auth Functions 
 */
export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Save extra profile data to Firestore
  await setDoc(doc(db, "users", user.uid), {
    name: name,
    email: email,
    createdAt: new Date().toISOString()
  });
  return user;
};

export const logoutUser = () => signOut(auth);

/** 
 * Cloud Storage & AI Inference Functions
 */
export const API_URL = "http://172.23.137.81:5000"; // Updated to actual PC IP
// Make sure this matches your PC's IP address on the Wi-Fi/Hotspot network!

export const uploadImageAndDetect = async (imageUri) => {
  let cloudUrl = null;
  try {
    // React Native needs FormData to be appended carefully for files
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'plant.jpg',
    });

    console.log("Sending to server:", `${API_URL}/predict`);
    
    const aiResponse = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });
    
    if (!aiResponse.ok) {
        throw new Error(`Server returned status: ${aiResponse.status}`);
    }
    
    const result = await aiResponse.json();
    return { success: true, aiResult: result, cloudUrl };
  } catch (error) {
    console.error("Upload/Inference Error:", error);
    return { success: false, error: error.message };
  }
};