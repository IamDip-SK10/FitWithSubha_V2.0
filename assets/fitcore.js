/* ==========================================================
   FitWithSubha — Shared Core (Firebase + Data + UI helpers)
   Reused by every page. Same Firebase project as the
   original app — do not change these credentials.
   ========================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, addDoc, query, where,
  orderBy, limit, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCsjpgM8JYYedSINwI5lIEX94dslq59I0w",
  authDomain: "fitwithsubhav2.firebaseapp.com",
  projectId: "fitwithsubhav2",
  storageBucket: "fitwithsubhav2.firebasestorage.app",
  messagingSenderId: "38056128401",
  appId: "1:38056128401:web:3a70455963b74cb738b430"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { collection, addDoc, query, where, orderBy, limit, getDocs, signOut };

/* ---------- Auth guard ----------
   Resolves with { user, isGuest }. Redirects to login.html
   if neither a Firebase user nor guest mode is present. */
export function requireAuth() {
  return new Promise((resolve) => {
    const isGuest = localStorage.getItem("guest") === "true";
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve({ user, isGuest: false });
      } else if (isGuest) {
        resolve({ user: null, isGuest: true });
      } else {
        window.location.href = "login.html";
      }
    });
  });
}

/* ---------- localStorage user-data snapshot ---------- */
export function getLocalData() {
  const num = (k) => {
    const v = parseFloat(localStorage.getItem(k));
    return isNaN(v) ? null : v;
  };
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem("weightHistory")) || [];
  } catch (e) {
    history = [];
  }
  let plan = null;
  try {
    plan = JSON.parse(localStorage.getItem("savedPlan")) || null;
  } catch (e) {
    plan = null;
  }
  return {
    heightUnit: localStorage.getItem("heightUnit") || "cm",
    heightValue: num("heightValue"),
    inchExtra: num("inchExtra") || 0,
    weight: num("weight"),
    age: num("age"),
    gender: localStorage.getItem("gender") || "",
    activity: localStorage.getItem("activity") || "",
    bmi: num("bmi"),
    calories: num("calories"),
    startWeight: num("startWeight"),
    targetWeight: num("targetWeight"),
    streak: parseInt(localStorage.getItem("streak")) || 0,
    lastEntryDate: localStorage.getItem("lastEntryDate") || null,
    weightHistory: history,
    savedPlan: plan
  };
}

/* ---------- BMI helpers ---------- */
export function bmiCategory(bmi) {
  if (bmi == null) return { label: "—", color: "#9ca3af" };
  if (bmi < 16) return { label: "Severely Underweight", color: "#ef4444" };
  if (bmi < 18.5) return { label: "Underweight", color: "#facc15" };
  if (bmi < 25) return { label: "Normal", color: "#22c55e" };
  if (bmi < 30) return { label: "Overweight", color: "#f97316" };
  return { label: "Obese", color: "#ef4444" };
}

/* ---------- Progress % toward target weight ---------- */
export function progressPercent({ startWeight, weight, targetWeight }) {
  if (startWeight == null || targetWeight == null) return 0;
  const current = weight != null ? weight : startWeight;
  const total = startWeight - targetWeight;
  if (total === 0) return 100;
  const done = startWeight - current;
  let pct = (done / total) * 100;
  if (!isFinite(pct)) pct = 0;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

/* ---------- Streak update (call once per check-in) ---------- */
export function bumpStreak() {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const last = localStorage.getItem("lastEntryDate");
  let streak = parseInt(localStorage.getItem("streak")) || 0;
  if (last === today) {
    // already checked in today, no change
  } else if (last === yesterday) {
    streak += 1;
  } else {
    streak = 1;
  }
  localStorage.setItem("streak", streak);
  localStorage.setItem("lastEntryDate", today);
  return streak;
}

/* ---------- Firestore: save a snapshot entry ---------- */
export async function saveUserEntry(user, data) {
  if (!user) return null;
  try {
    return await addDoc(collection(db, "users"), {
      email: user.email,
      date: new Date().toISOString(),
      ...data
    });
  } catch (e) {
    console.log("Firestore save error:", e);
    return null;
  }
}

/* ---------- Firestore: fetch recent entries for this user ---------- */
export async function getRecentEntries(user, max = 5) {
  if (!user) return [];
  try {
    const q = query(
      collection(db, "users"),
      where("email", "==", user.email),
      orderBy("date", "desc"),
      limit(max)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
  } catch (e) {
    // Firestore composite index may not exist yet — fail soft
    console.log("Firestore fetch error:", e);
    return [];
  }
}

/* ---------- Daily action checklist (localStorage, per-day) ---------- */
export function getTodayChecklist() {
  const key = "dailyActions_" + new Date().toDateString();
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch (e) {
    return {};
  }
}
export function setTodayChecklist(obj) {
  const key = "dailyActions_" + new Date().toDateString();
  localStorage.setItem(key, JSON.stringify(obj));
}

/* ---------- Toast ---------- */
export function toast(message, type = "info") {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.innerHTML = message;
  wrap.appendChild(el);
  setTimeout(() => {
    el.style.transition = "opacity .3s ease";
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 2600);
}

/* ---------- Greeting ---------- */
export function greetingWord() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ---------- Display name from Firebase user or guest ---------- */
export function displayName(user, isGuest) {
  if (isGuest) return "Guest";
  if (!user) return "there";
  if (user.displayName) return user.displayName.split(" ")[0];
  if (user.email) return user.email.split("@")[0];
  return "there";
}

/* ---------- Sign out (used by nav / profile) ---------- */
export async function doSignOut() {
  localStorage.removeItem("guest");
  try {
    await signOut(auth);
  } catch (e) { /* noop */ }
  window.location.href = "login.html";
}
window.doSignOut = doSignOut;
