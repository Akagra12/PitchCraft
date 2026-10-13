# PitchCraft — The Startup Idea Evaluator
## Project Document

---

## 1. Project Title & Overview

**PitchCraft — Startup Ideas** is a mobile application built with React Native and Expo that enables users to submit startup ideas, receive instant AI-style evaluation scores, vote on ideas from others, and track the top-performing ideas on a leaderboard.

The application demonstrates competence in building multi-screen interactive mobile UIs, integrating mock APIs, managing local state and persistent storage, and delivering a polished, production-quality user experience.

---

## 2. Problem Statement

Aspiring entrepreneurs often struggle to get quick, objective feedback on their startup ideas. There is no simple, fun tool that lets people pitch an idea in seconds, receive immediate evaluation, and see how their concept stacks up against others.

PitchCraft addresses this by providing:
- A frictionless submission process
- Instant AI-style scoring and feedback
- Community voting to surface the most popular ideas
- A competitive leaderboard to motivate better pitches

---

## 3. Objectives

1. Build a fully functional, multi-screen mobile application using React Native and Expo.
2. Implement idea submission with form validation and meaningful error feedback.
3. Create a mock AI evaluation engine that produces explainable, reproducible scores.
4. Enable community voting with per-device duplicate prevention.
5. Display a leaderboard ranking the top ideas with visual badges and indicators.
6. Persist all data locally using AsyncStorage so the app survives restarts.
7. Deliver a polished, dark-themed UI suitable for a professional portfolio.

---

## 4. Technology Stack

| Technology | Version | Justification |
|---|---|---|
| **React Native** | 0.86 | Industry-standard cross-platform mobile framework |
| **Expo SDK** | 57 | Simplifies development, testing, and deployment |
| **TypeScript** | 6.0 | Type safety catches bugs early, improves maintainability |
| **React Navigation** | 7.x | Mature, well-documented navigation library |
| **AsyncStorage** | Latest | Recommended local key-value storage for React Native |
| **@expo/vector-icons** | Bundled | Expo-compatible icon library (Ionicons) |
| **expo-clipboard** | Latest | Native clipboard access for share functionality |
| **React Context** | Built-in | Lightweight state management — no Redux overhead |

**Why this stack?**
- Expo provides the fastest path from development to a shareable APK without requiring Android Studio setup.
- TypeScript ensures code quality and makes the codebase interview-friendly.
- React Context is sufficient for this scale — adding Redux or Zustand would be over-engineering.
- AsyncStorage is the assignment-recommended persistence solution.

---

## 5. Features & User Flow

### User Flow Diagram

```
┌──────────────┐      ┌───────────────┐      ┌─────────────────┐
│  Ideas Tab   │ ◄──► │  Create Tab   │ ◄──► │ Leaderboard Tab │
│  (Listing)   │      │  (Submit)     │      │  (Top 5)        │
└──────────────┘      └───────────────┘      └─────────────────┘
       │                      │
       ├─ Sort (Rating/Votes) ├─ Fill form
       ├─ Upvote              ├─ Validate
       ├─ Read More/Less      ├─ Mock AI Score
       ├─ Share               ├─ Save & Navigate
       └─ Dark Mode Toggle    └─ See Result Card
```

### Feature Matrix

| Feature | Status | Screen |
|---|---|---|
| Idea submission with 3 fields | ✅ Implemented | Create |
| Input validation with error messages | ✅ Implemented | Create |
| Mock AI score (0–100) | ✅ Implemented | Create |
| AI feedback message | ✅ Implemented | Create |
| Save locally + navigate to listing | ✅ Implemented | Create |
| Display name, tagline, score, votes | ✅ Implemented | Ideas |
| Upvote button (one per idea) | ✅ Implemented | Ideas |
| Read More / Show Less | ✅ Implemented | Ideas |
| Sort by rating or votes | ✅ Implemented | Ideas |
| Immediate UI update after voting | ✅ Implemented | Ideas |
| Top 5 ideas display | ✅ Implemented | Leaderboard |
| Rank by votes or rating | ✅ Implemented | Leaderboard |
| 🥇🥈🥉 badges for top 3 | ✅ Implemented | Leaderboard |
| Cards with gradients/shadows | ✅ Implemented | Leaderboard |
| Dark mode toggle | ✅ Implemented | Ideas (header) |
| Toast notifications | ✅ Implemented | All screens |
| Share via share sheet/clipboard | ✅ Implemented | Ideas |
| Double-submit prevention | ✅ Implemented | Create |
| Sample data seeding | ✅ Implemented | First launch |

---

## 6. Application Architecture

```
App.tsx (Entry Point)
  └─ AppProvider (React Context)
       └─ NavigationContainer
            └─ BottomTabNavigator
                 ├─ IdeasScreen
                 │    ├─ IdeaCard (×N)
                 │    │    └─ ScoreBadge
                 │    ├─ EmptyState (when no ideas)
                 │    └─ Toast
                 ├─ CreateScreen
                 │    ├─ ScoreBadge (result)
                 │    └─ Toast
                 └─ LeaderboardScreen
                      ├─ LeaderCard (×5)
                      │    └─ ScoreBadge
                      └─ EmptyState (when no ideas)
```

**Separation of concerns:**
- **Screens** handle layout, user interaction, and navigation.
- **Components** are reusable UI elements (IdeaCard, ScoreBadge, Toast, EmptyState).
- **Services** contain business logic (evaluator.ts, storage.ts).
- **Context** manages global state and exposes actions to screens.
- **Types** define the data model.

---

## 7. Data Model & Local Storage

### Idea Interface

```typescript
interface Idea {
  id: string;           // Unique identifier (timestamp + random)
  startupName: string;  // Startup name
  tagline: string;      // One-liner tagline
  description: string;  // Full description
  rating: number;       // Mock AI score (0–100)
  feedback: string;     // AI feedback message
  votes: number;        // Vote count
  createdAt: string;    // ISO date string
}
```

### Storage Keys

| Key | Content | Format |
|---|---|---|
| `@pitchcraft_ideas` | All submitted ideas | JSON array of Idea objects |
| `@pitchcraft_voted_ids` | IDs the user has voted on | JSON array of strings |
| `@pitchcraft_seeded` | Whether seed data has been added | `"true"` or absent |

### Storage Strategy

- Data is loaded from AsyncStorage on app mount.
- Every submission or vote immediately persists to AsyncStorage.
- On save failure, state is rolled back and a toast error is shown.
- Seed data (6 sample ideas) is inserted only when storage is completely empty and has never been seeded.

---

## 8. Mock AI Rating Methodology

The mock evaluator (`src/services/evaluator.ts`) produces a score using five deterministic checks plus a random jitter:

| Component | Max Points | Logic |
|---|---|---|
| Description word count | 30 | 50+ words = 30, 30+ = 22, 15+ = 14, 5+ = 7 |
| Tagline word count | 15 | 4–12 words = 15, 2+ = 8, 1+ = 3 |
| Name length | 10 | 3–30 chars = 10, 1+ = 4 |
| Trending keywords | 20 | 4 pts per keyword match, capped at 20 |
| Sentence punctuation | 10 | 3+ sentence endings = 10, 1+ = 5 |
| Random jitter | ±10 | Uniform random from -10 to +10 |

**Total range:** 0–100 (clamped)

This approach is:
- **Transparent** — every point is traceable.
- **Fun** — the jitter makes repeated submissions interesting.
- **Explainable** — easy to discuss in an interview.

---

## 9. Voting & Leaderboard Logic

### Voting
1. User taps "Upvote" on an idea card.
2. The app checks `votedIds` (a Set loaded from AsyncStorage).
3. If the idea ID is already in the set → toast: "You have already voted for this idea."
4. Otherwise → increment `votes`, add ID to `votedIds`, persist both, show success toast.
5. The button changes to "Voted" (disabled) with a checkmark icon.
6. This restriction persists across app restarts.

### Leaderboard
1. Takes the full ideas array from context.
2. Sorts by the selected mode (votes or rating).
3. Slices to the top 5.
4. Renders LeaderCards with rank badges:
   - Ranks 1–3 get emoji badges (🥇🥈🥉) and colored borders.
   - Ranks 4–5 get numeric badges (#4, #5).
5. If fewer than 5 ideas exist, shows only what's available with no empty slots.

---

## 10. Validation & Error Handling

### Form Validation (CreateScreen)

| Field | Rule | Error Message |
|---|---|---|
| Startup Name | Required, 2–60 chars | "Startup name is required." / "Name must be at least 2 characters." |
| Tagline | Required, 5–120 chars | "Tagline is required." / "Tagline should be at least 5 characters." |
| Description | Required, ≥20 chars | "Description is required." / "Description should be at least 20 characters." |

Errors clear as the user types. The submit button is disabled while saving.

### Storage Errors
- All AsyncStorage operations are wrapped in try/catch.
- Failures throw descriptive errors that propagate to toast notifications.
- Vote failures trigger a state rollback.

### Edge Cases
- Double-tap submit prevention via ref flag.
- Empty state components for no-data scenarios.
- Long text handling with `numberOfLines` truncation.

---

## 11. Testing Performed & Results

### Automated Quality & Regression Tests

| Check / Test Suite | Command | Result |
|---|---|:---:|
| TypeScript static typecheck | `npm run typecheck` (`tsc --noEmit`) | ✅ Passes (0 errors) |
| Automated unit & functional suite | `npm test` (`tsx tests/run_tests.ts`) | ✅ 15/15 Passed (0 failed) |
| Expo Metro bundler & web server | `npm run web` | ✅ Starts on http://localhost:8081 |
| SDK 57 package compatibility | `npx expo install --check` | ✅ Compatible |

### Verified Functional Scenarios

| # | Scenario | Test Method | Status |
|---|---|---|:---:|
| 1 | Submit idea with valid data | Automated validator & Live UI | ✅ PASS |
| 2 | Reject blank or invalid fields | Automated validator & Live UI | ✅ PASS |
| 3 | Generate 0–100 mock AI score & feedback | Automated evaluator suite (50 iterations) | ✅ PASS |
| 4 | New idea appears in listing | State management & Live UI | ✅ PASS |
| 5 | Expand/collapse full description | IdeaCard toggle & Live UI | ✅ PASS |
| 6 | Upvote increases count immediately | State engine & Live UI | ✅ PASS |
| 7 | Duplicate vote blocked ("Voted" state) | Context & Set persistence test | ✅ PASS |
| 8 | Data persists across app restarts | AsyncStorage key-value roundtrip | ✅ PASS |
| 9 | Sort by rating and votes with tiebreakers | Deterministic sort test suite | ✅ PASS |
| 10 | Leaderboard shows top 5 with podium badges | Leaderboard slice & render test | ✅ PASS |
| 11 | Consistency between listing & leaderboard | Unified AppContext sorting | ✅ PASS |
| 12 | Navigation across all 3 bottom tabs | React Navigation verification | ✅ PASS |

---

## 12. Setup & Usage Instructions

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- Expo Go app on Android/iOS

### Quick Start
```bash
git clone https://github.com/YOUR_USERNAME/PitchCraft.git
cd PitchCraft
npm install
npx expo start
```

Scan the QR code with Expo Go to run on your phone.

### Build APK
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

---

## 13. Screenshots

> **[INSERT SCREENSHOTS HERE]**
>
> After running the app, take screenshots of:
> 1. Ideas listing screen
> 2. Create screen with form
> 3. Mock AI evaluation result
> 4. Leaderboard with top 5
> 5. Dark mode appearance
>
> Paste them into this section of the Google Doc.

---

## 14. Limitations & Future Improvements

### Current Limitations
- Mock AI scoring — not a real ML model
- Local-only storage — no cloud sync or backup
- Per-device voting — no user accounts
- Text-only ideas — no images or attachments
- No search or filter beyond sort

### Future Improvements
- Integrate a real AI API (GPT-4, Gemini) for genuine feedback
- Add Firebase/Supabase backend for multi-user support
- Implement user authentication and profiles
- Add idea categories and search
- Enable comments and discussion threads
- Push notifications for votes on your ideas
- Analytics dashboard for idea performance
- Image attachments and pitch decks
