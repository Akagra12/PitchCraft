# 🚀 PitchCraft — Startup Ideas

**The Startup Idea Evaluator – AI + Voting App**

A polished React Native mobile application where users submit startup ideas, receive instant AI-style evaluation scores, vote on others' ideas, and track top performers on a leaderboard.

Built as the PG-AGI Mobile App Internship Assignment.

---

## 📱 Screenshots

> **Insert genuine screenshots here** after running the app on a device or emulator.
>
> Suggested screenshots:
> 1. Ideas listing screen (with sort controls and idea cards)
> 2. Create/Submit screen (showing the form)
> 3. Evaluation result (showing mock AI score and feedback)
> 4. Leaderboard screen (showing top 5 with badges)
> 5. Dark mode vs light mode comparison

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **React Native** (v0.86) | Cross-platform mobile framework |
| **Expo SDK 57** | Development toolchain, build system |
| **TypeScript** | Type safety and code clarity |
| **React Navigation** | Bottom-tab navigation between screens |
| **AsyncStorage** | Local data persistence (ideas, votes) |
| **@expo/vector-icons** | Ionicons icon set |
| **expo-clipboard** | Copy-to-clipboard / share functionality |
| **React Context** | Lightweight state management |

No backend, database server, or paid AI API is used. The entire application runs locally on-device.

---

## ✅ Features Implemented

### Core Features (Required)

- **Idea Submission Screen**
  - Fields for startup name, tagline, and description
  - Input validation with clear error messages
  - Mock AI score generation (0–100) with feedback
  - Saves idea locally and navigates to the listing
  - Double-submit prevention

- **Idea Listing Screen**
  - Displays startup name, tagline, AI score, and vote count
  - Upvote button with one-vote-per-idea enforcement (persists across app restarts)
  - "Read more" to expand/collapse full description
  - Sort by rating or votes
  - Immediate UI update after voting

- **Leaderboard Screen**
  - Top 5 ideas display
  - Rank by votes or AI rating
  - 🥇🥈🥉 badges for top three with colored highlights
  - Attractive cards with score indicators and subtle shadows
  - Handles fewer than 5 ideas gracefully

### Bonus Features

- ☀️/🌙 **Dark mode toggle** (default: dark theme)
- 🔔 **Toast notifications** on submission, voting, and errors
- 📤 **Share idea** via native share sheet or clipboard
- ✨ **Subtle animations** on toast notifications
- 🎨 **Consistent design system** with custom color palette

---

## 🗂 Screens & Navigation

The app uses bottom-tab navigation with three tabs:

| Tab | Screen | Description |
|---|---|---|
| 💡 Ideas | `IdeasScreen` | Browse, sort, vote, expand, and share ideas |
| ➕ Create | `CreateScreen` | Submit a new startup idea with AI evaluation |
| 🏆 Leaderboard | `LeaderboardScreen` | Top 5 ideas ranked by votes or rating |

---

## 🤖 How the Mock AI Evaluator Works

Located in `src/services/evaluator.ts`.

The mock evaluator generates a score from 0–100 **without calling any external API**. It uses these simple, explainable heuristics:

1. **Content Completeness (0–30 pts):** Longer, more detailed descriptions score higher.
2. **Tagline Quality (0–15 pts):** Taglines of 4–12 words score highest.
3. **Name Quality (0–10 pts):** Names between 3–30 characters get full points.
4. **Keyword Bonus (0–20 pts):** Mentions of trending startup terms (AI, SaaS, fintech, etc.) add points.
5. **Sentence Structure (0–10 pts):** Descriptions with proper punctuation score higher.
6. **Random Jitter (±10 pts):** Adds variety so each submission feels unique.

The score is clamped to 0–100, and a tier-based feedback message (emoji + text) is selected based on the final score.

The result is labeled **"Mock AI Score"** and **"Mock AI Feedback"** with a disclaimer that this is a simulated evaluator.

---

## 💾 Local Storage & Voting

- **Storage:** All ideas and voted IDs are stored in `AsyncStorage` via `src/services/storage.ts`.
- **Persistence:** Data survives app restarts. On first launch, 6 sample ideas are seeded (only when storage is empty).
- **Voting:** Each idea can only receive one vote per installation. The set of voted IDs is saved separately and checked before every vote.
- **Consistency:** The listing and leaderboard use the same underlying data from React Context.
- **Error handling:** Storage failures show a toast message and, where possible, rollback state changes.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **Expo Go** app on your Android/iOS phone (for dev testing)
- (Optional) **EAS CLI** for building the APK: `npm install -g eas-cli`

### Installation

```bash
# Clone the repository
git clone https://github.com/Akagra12/PitchCraft.git
cd PitchCraft

# Install dependencies
npm install
```

### Run Locally (Development)

```bash
# Start the Expo development server
npx expo start

# Scan the QR code with Expo Go app on your phone
# Or press 'a' for Android emulator / 'i' for iOS simulator
```

### Run on Android Emulator

```bash
npx expo start --android
```

### Run on iOS Simulator (macOS only)

```bash
npx expo start --ios
```

### Run in Web Browser

```bash
npm run web
# Opens app at http://localhost:8081
```

---

## 🧪 Running Tests & Quality Checks

```bash
# Run automated unit and functional test suite (15 tests)
npm test

# Run TypeScript static type checking
npm run typecheck
```

## 📦 Building the Android APK

### Option A: EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to your Expo account
eas login

# Build the APK (preview profile)
eas build --platform android --profile preview

# After the build completes, download the APK from the URL provided
```

### Option B: Local APK Build

```bash
# Requires Android SDK and Java set up locally
npx expo run:android --variant release
```

---

## 📁 Project Structure

```
PitchCraft/
├── App.tsx                          # Entry point — navigation + providers
├── app.json                         # Expo configuration
├── eas.json                         # EAS Build configuration
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── src/
│   ├── context/
│   │   └── AppContext.tsx            # Global state (ideas, votes, theme)
│   ├── components/
│   │   ├── IdeaCard.tsx              # Idea card with vote, share, expand
│   │   ├── ScoreBadge.tsx            # Circular AI score indicator
│   │   ├── EmptyState.tsx            # Empty list placeholder
│   │   └── Toast.tsx                 # Animated toast notification
│   ├── screens/
│   │   ├── IdeasScreen.tsx           # Idea listing with sort
│   │   ├── CreateScreen.tsx          # Submission form + evaluation
│   │   └── LeaderboardScreen.tsx     # Top 5 ranking
│   ├── services/
│   │   ├── evaluator.ts             # Mock AI scoring engine
│   │   └── storage.ts               # AsyncStorage persistence layer
│   ├── data/
│   │   └── seedIdeas.ts             # Sample ideas for first launch
│   └── types/
│       └── Idea.ts                  # TypeScript interfaces
├── assets/                          # App icons and splash screen
├── PROJECT_DOCUMENT.md              # Detailed project documentation
├── DEMO_SCRIPT.md                   # 2–3 minute demo walkthrough
└── TEST_CHECKLIST.md                # Feature & test verification
```

---

## ⚠️ Known Limitations

1. **No real AI model:** The evaluator uses keyword matching and heuristics. A real AI integration (GPT, Gemini, etc.) would require an API key and backend.
2. **No user authentication:** All votes are per-device, tracked via AsyncStorage. A multi-user system would need a backend.
3. **No cloud sync:** Data lives only on the device. Reinstalling the app clears all data.
4. **Single device voting:** The "one vote per idea" restriction is per-installation, not per-user.
5. **No image/media attachments:** Ideas are text-only.

---

## 📄 License

This project was built as part of the PG-AGI Mobile App Internship assignment.
