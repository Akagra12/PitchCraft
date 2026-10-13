/**
 * Represents a startup idea submitted by a user.
 */
export interface Idea {
  id: string;
  startupName: string;
  tagline: string;
  description: string;
  rating: number;       // Mock AI score 0–100
  feedback: string;     // Generated feedback message
  votes: number;
  createdAt: string;    // ISO date string
}

/**
 * Sort options for the idea listing screen.
 */
export type SortOption = 'rating' | 'votes';

/**
 * Rank mode for the leaderboard.
 */
export type RankMode = 'votes' | 'rating';
