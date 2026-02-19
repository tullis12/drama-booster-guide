import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWsr-v6mT9qZWaDF5Apt4FMlIYuppuGQ4",
  authDomain: "drama-boosters-guide.firebaseapp.com",
  projectId: "drama-boosters-guide",
  storageBucket: "drama-boosters-guide.firebasestorage.app",
  messagingSenderId: "811564158252",
  appId: "1:811564158252:web:3d3ed16d2927ea751d3089",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const storage = {
  async get(key) {
    try {
      const snap = await getDoc(doc(db, "guides", key));
      return snap.exists() ? { key, value: snap.data().value } : null;
    } catch (e) {
      console.error("Get error:", e);
      return null;
    }
  },
  async set(key, value) {
    try {
      await setDoc(doc(db, "guides", key), { value, updatedAt: new Date().toISOString() });
      return { key, value };
    } catch (e) {
      console.error("Set error:", e);
      return null;
    }
  },
  async delete(key) {
    try {
      await deleteDoc(doc(db, "guides", key));
      return { key, deleted: true };
    } catch (e) {
      console.error("Delete error:", e);
      return null;
    }
  },
  async list(prefix) {
    try {
      const snap = await getDocs(collection(db, "guides"));
      const keys = [];
      snap.forEach((d) => {
        if (!prefix || d.id.startsWith(prefix)) keys.push(d.id);
      });
      return { keys };
    } catch (e) {
      console.error("List error:", e);
      return { keys: [] };
    }
  },
};
