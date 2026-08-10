# FitWithSubha — AI Personal Fitness & Wellness Coach

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS%20%7C%20Firebase-blue)
![License](https://img.shields.io/badge/license-unlicensed-lightgrey)

FitWithSubha is a full-featured fitness web app that turns your body stats, goals, and daily activity into a personalized plan you can actually follow — body analysis, smart fitness planning, nutrition and workout tracking, progress analytics, and an AI coach, all in one place.

**Live demo:** https://iamdip-sk10.github.io/FitWithSubha_V2.0/
**Repository:** https://github.com/IamDip-SK10/FitWithSubha_V2.0

---

## ✨ Features

- **Authentication** — Email/password signup & login (with email verification) via Firebase Auth, plus a Guest mode for trying the app without an account
- **Smart landing** — new users are guided through onboarding from the Dashboard; returning users with existing data land straight on Progress
- **Dashboard** — personalized greeting, BMI, daily/target calories, progress ring, today's overview, and recent activity synced from Firestore
- **Body Stats** — BMI, BMR, and daily calorie calculator with unit conversion (kg/lbs, cm/ft-in) and full input validation
- **Fitness Plan** — goal-based plan generator (weight loss / muscle gain) with calorie targets, workout split, dietary preference, and AI-style suggestions, based on real BMR/TDEE math
- **Nutrition Tracking** — daily calorie ring, meal logging with protein/carb tracking, and an 8-glass water tracker
- **Workouts** — category-based workout checklist (Strength / Cardio / Flexibility), weekly consistency grid, and streak tracking
- **Progress Analytics** — Chart.js weight trend vs. target, BMI trend, workout consistency, and auto-generated Smart Insights based on real logged data
- **AI Coach** — a rules-based coaching engine that parses free-text goals (e.g. *"weight is 85, target is 75, in 3 months"*) and computes a real, personalized calorie/workout/diet breakdown using the same math as the Fitness Plan page — reasoning over your actual stored stats rather than canned responses
- **My Journey** — founder's transformation story page
- **Profile** — account info, fitness summary, saved goal, and preferences, all pulled from real stored data

## 🛠 Tech Stack

- **Frontend:** Plain HTML, CSS, JavaScript (no framework, no build step)
- **Auth & Database:** Firebase Authentication (Email/Password) + Cloud Firestore
- **Local persistence:** `localStorage` for on-device data (body stats, plans, nutrition, workouts) with Firestore sync for cross-device history
- **Charts:** Chart.js
- **Icons/Fonts:** Font Awesome, Google Fonts (Poppins)
- **Hosting:** GitHub Pages

## 📁 Project Structure

```
/
├── index.html          # Splash / landing (auth-state redirect)
├── login.html           # Login + guest mode
├── signup.html          # Signup + email verification
├── dashboard.html        # Main hub
├── bodystat.html         # BMI / BMR / calorie calculator
├── plan.html             # Smart fitness plan generator
├── nutrition.html        # Meal & water tracking
├── workouts.html          # Workout checklist & streaks
├── progress.html          # Weight trend, insights, analytics
├── aicoach.html           # AI coaching chat
├── myjourney.html         # Founder transformation story
├── profile.html           # Account & fitness summary
├── bmilogo.png
├── fitness.png
└── assets/
    ├── theme.css          # Shared design system
    └── fitcore.js         # Shared Firebase init + data helpers
```

## 🔧 Setup

1. Clone the repo:
   ```
   git clone https://github.com/IamDip-SK10/FitWithSubha_V2.0.git
   ```
   No build step or `npm install` required — open `index.html` directly or serve the folder with any static server.
2. **Firebase project setup:**
   - Create a Firebase project → enable **Authentication → Email/Password**
   - Create a **Cloud Firestore** database (collections `users`, `plans`, `progress` are created automatically on first write)
   - Under Authentication → Settings → Authorized domains, add your local/dev domain and `iamdip-sk10.github.io`
3. The Firebase config is inlined directly in each page's `<script type="module">` block (and in `assets/fitcore.js` for the shared pages). If you fork this repo, replace the `firebaseConfig` object in all of these files with your own project's config:
   - `index.html`, `login.html`, `signup.html`, `bodystat.html`, `plan.html`, `progress.html`, `assets/fitcore.js`
4. Deploy as a static site — this project is currently hosted on **GitHub Pages** (Settings → Pages → deploy from the `main` branch root).

## 🧪 Testing the app

No signup required to try it — click **"Continue as Guest"** on the login page. Guest mode uses local storage only (no cross-device sync). Suggested flow:

```
Body Stats → Fitness Plan → Progress (auto-populates from your plan)
→ Workouts (tick one off, watch Progress update)
→ AI Coach (try: "weight is 85, target is 75, in 3 months")
```

## 📱 Design

Fully responsive — sidebar navigation on desktop, bottom tab bar on mobile. Built as a premium health-tech product experience: clean cards, subtle gradients, skeleton loading states, empty states, and toasts throughout.

## 📸 Screenshots

> _Add screenshots of Dashboard, Fitness Plan, Progress, and AI Coach here — drag images into this section on GitHub or reference them from a `/screenshots` folder, e.g.:_
> `![Dashboard](screenshots/dashboard.png)`

## 🚧 Roadmap / Known Limitations

- AI Coach is a rule-based engine reasoning over stored user data — not a connected LLM API (no backend/API key in this project yet)
- No payment/subscription layer
- No real-user validation yet — built as a solo project

## 👤 Author

**Subhadip** — [Instagram](https://instagram.com/i_am_dip_07)

## 📄 License

This project is currently unlicensed / all rights reserved by the author. Add a license file if you intend to open-source it.
