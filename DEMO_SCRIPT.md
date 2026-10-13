# PitchCraft — Demo Video Script
## 2–3 Minute Walkthrough for Loom/YouTube

---

### Recording Setup
- Open PitchCraft on your phone or emulator
- Start on the **Ideas** tab
- Use screen recording (Loom desktop or phone screen recorder)
- Speak naturally — this isn't a formal presentation

---

### Script

**[0:00 – 0:15] Introduction**
> *Show: Ideas listing screen*

"Hey! This is PitchCraft, a startup idea evaluator app I built for the PG-AGI internship assignment. It's a React Native app built with Expo and TypeScript. Let me walk you through the key features."

---

**[0:15 – 0:30] Ideas Listing Overview**
> *Show: Ideas tab with the seeded ideas visible*

"This is the main Ideas screen. You can see startup ideas listed as cards — each showing the startup name, tagline, a mock AI score, and the current vote count. I've seeded a few sample ideas so the app isn't empty on first launch."

---

**[0:30 – 0:50] Sorting**
> *Tap: Sort by Votes button, then Sort by Rating button*

"Up here we have sort controls. I can sort by Rating — which orders by the AI score — or by Votes — which orders by popularity. The list updates immediately."

---

**[0:50 – 1:10] Submitting a New Idea**
> *Tap: Create tab → fill in the form*

"Let me submit a new idea. I'll tap the Create tab. Here's the submission form with three fields — startup name, tagline, and description. Let me fill in an idea..."

*Type something like:*
- Name: "FreshRoute"
- Tagline: "AI-powered grocery delivery optimization"
- Description: "FreshRoute uses machine learning to optimize grocery delivery routes, reducing food waste and delivery times. It integrates with local grocery stores and uses real-time traffic data to plan the most efficient routes for drivers."

"Now I'll tap 'Evaluate & Submit'."

---

**[1:10 – 1:30] Viewing the AI Score**
> *Show: The result card that appears*

"The app generates a mock AI score — you can see it right here with the score out of 100 and a feedback message. This isn't a real AI — it uses keyword matching, content length analysis, and a bit of randomness to produce an explainable score. It's clearly labeled as a 'Mock AI Evaluation'."

"After a moment, it automatically navigates back to the Ideas tab where my new idea appears at the top."

---

**[1:30 – 1:50] Read More & Voting**
> *Show: Ideas tab → tap Read More on an idea → tap Upvote*

"Each card has a 'Read more' option to expand the full description. And here's the upvote button — let me vote for this idea. You can see the count goes up, I get a success toast, and the button changes to 'Voted'. If I try to vote again..."

> *Tap: Upvote again on the same idea*

"...it blocks me with a message saying I've already voted. This restriction persists even if I close and reopen the app, because the voted IDs are saved in AsyncStorage."

---

**[1:50 – 2:15] Leaderboard**
> *Tap: Leaderboard tab*

"Now the Leaderboard — it shows the top 5 ideas. You can see gold, silver, and bronze badges for the top three. I can toggle between ranking by votes or by AI rating. The cards show the score badge and vote count for each idea."

---

**[2:15 – 2:35] Dark Mode & Share**
> *Navigate back to Ideas tab → tap the sun/moon icon → tap share on a card*

"A couple bonus features — here's the dark mode toggle. And I can share any idea using the native share sheet, which includes the startup name, tagline, score, and description."

---

**[2:35 – 2:50] Technical Summary**
> *Show: The Ideas screen (either theme)*

"Quick tech summary: this is built with React Native and Expo SDK 57, using TypeScript, React Navigation for the tabs, AsyncStorage for persistence, and React Context for state management. No backend or paid APIs — everything runs locally on the device."

"Thanks for watching! The full source code is on GitHub."

---

### Tips for Recording
- Keep each section moving — don't pause too long on any screen
- If you make a typo, just correct it naturally
- Aim for ~2:30, no more than 3:00
- Upload to YouTube (unlisted) or Loom and copy the share link
