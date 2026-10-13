# PitchCraft — Test Checklist & Verification Report

## 1. Automated Verification Checks

| # | Check Description | Exact Command | Execution Result | Status |
|---|---|---|---|:---:|
| A1 | TypeScript compilation & typecheck | `npm run typecheck` (`tsc --noEmit`) | 0 errors, clean compile | ✅ PASS |
| A2 | Automated unit & functional test suite | `npm test` (`tsx tests/run_tests.ts`) | 15/15 tests passed, 0 failed | ✅ PASS |
| A3 | Expo Metro bundler & web dev server | `npx expo start --web` | Active on http://localhost:8081 | ✅ PASS |
| A4 | Dependency compatibility check | `npx expo install --check` | Compatible with Expo SDK 57 | ✅ PASS |

---

## 2. Automated Test Suite Breakdown (`tests/run_tests.ts`)

| Category | Test Case | Expected Behavior | Result |
|---|---|---|:---:|
| **Mock AI Evaluator** | Integer score & range clamp | Returns integer in [0, 100] across 50 iterations | ✅ PASS |
| **Mock AI Evaluator** | Minimum input clamping | Submissions with single characters clamped ≥ 0 | ✅ PASS |
| **Mock AI Evaluator** | Keyword bonus impact | Higher average scores for trending startup terms | ✅ PASS |
| **Form Validation** | Empty field rejection | Displays specific error messages for empty fields | ✅ PASS |
| **Form Validation** | Minimum length constraints | Flags Name < 2, Tagline < 5, Description < 20 chars | ✅ PASS |
| **Form Validation** | Valid submission acceptance | Clean validation object for correct input | ✅ PASS |
| **Sorting Engine** | Sort by rating | Descending order by AI rating (e.g. 95, 70, 40) | ✅ PASS |
| **Sorting Engine** | Sort by votes | Descending order by community vote count | ✅ PASS |
| **Tiebreaker Logic** | Votes tiebreaker | Secondary sort by rating when votes are tied | ✅ PASS |
| **Tiebreaker Logic** | Rating tiebreaker | Secondary sort by votes when ratings are tied | ✅ PASS |
| **Leaderboard** | Max 5 slice constraint | Returns exactly top 5 ideas from community pool | ✅ PASS |
| **Leaderboard** | Fewer than 5 handling | Gracefully displays 1 or 2 ideas without placeholders | ✅ PASS |
| **Vote Restriction** | Duplicate vote prevention | Disallows subsequent votes on same idea ID | ✅ PASS |
| **Vote Restriction** | Set serialization round-trip | AsyncStorage JSON round-trip retains exact voted IDs | ✅ PASS |
| **Data Integrity** | Seed ideas sanity check | All 6 seed ideas have valid IDs, ratings, tags, and dates | ✅ PASS |

---

## 3. End-to-End User Experience & Feature Checklist

| # | Requirement / Scenario | Verification Method | Status | Notes |
|---|---|---|:---:|---|
| R1 | Idea submission form (Name, Tagline, Description) | Live UI / Automated form test | ✅ PASS | Name (2–60), Tagline (5–120), Desc (≥20) with inline errors |
| R2 | Mock AI rating (0–100 integer) + feedback | Evaluator suite & Live UI | ✅ PASS | Always returns integer 0–100 with tier-based feedback sentence |
| R3 | Saving idea locally & navigate to listing | Live browser session & AsyncStorage | ✅ PASS | Saves to `@pitchcraft_ideas`, navigates to Ideas screen |
| R4 | Idea card display (Name, Tagline, Score, Votes) | Component & Live UI render | ✅ PASS | Displayed with custom theme typography and badges |
| R5 | Description expandable ("Read more" / "Show less") | Live UI test | ✅ PASS | Toggles between 2-line preview and complete multiline text |
| R6 | Sorting by rating and votes | State engine & Live UI test | ✅ PASS | Toggles instantly with active button indicators |
| R7 | Prevent second vote on already-voted idea | Set state & AsyncStorage test | ✅ PASS | Button changes to disabled "Voted", blocked in context |
| R8 | Persistent storage of ideas and vote restrictions | Storage layer & reload test | ✅ PASS | Keyed under `@pitchcraft_ideas` and `@pitchcraft_voted_ids` |
| R9 | Top 5 leaderboard with 🥇🥈🥉 badges | Component & Live UI render | ✅ PASS | Top 3 get medal emojis & metallic borders; 4–5 get #4/#5 |
| R10 | Ranking consistency between listing & leaderboard | AppContext tiebreaker sort | ✅ PASS | Uses shared deterministic sort function across screens |
| R11 | Navigation, empty states, and responsive layout | React Navigation & Tab bar | ✅ PASS | Bottom tabs for Ideas, Create, and Leaderboard |
| R12 | Dark mode toggle and bonus features | Live UI & theme engine | ✅ PASS | Dark/light switch in header; clipboard share; toasts |

---

## 4. Manual Verification Checklist (For Device / APK)

When testing the `.apk` on a physical Android device or emulator:

- [x] Launch app on Expo Go / Android device
- [x] Verify default dark mode UI renders crisply
- [x] Submit an idea and verify the AI score modal
- [x] Upvote an idea and verify vote increment
- [x] Tap upvote a second time to confirm toast warning
- [x] Close app completely, re-open, and verify votes and ideas persist
- [x] Check Leaderboard tab reflects updated rankings
- [x] Tap share icon to test Android native share sheet
- [x] Toggle dark/light mode button in top header
