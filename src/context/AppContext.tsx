import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Idea, SortOption } from '../types/Idea';
import { loadIdeas, saveIdeas, loadVotedIds, saveVotedIds, hasSeeded, markSeeded } from '../services/storage';
import { SEED_IDEAS } from '../data/seedIdeas';
import { Colors, ThemeColors } from '../theme/theme';

interface AppContextType {
  ideas: Idea[];
  votedIds: Set<string>;
  isLoading: boolean;
  isDark: boolean;
  colors: ThemeColors;
  addIdea: (idea: Idea) => Promise<void>;
  upvoteIdea: (id: string) => Promise<{ success: boolean; message: string }>;
  toggleDarkMode: () => void;
  sortIdeas: (ideas: Idea[], by: SortOption) => Idea[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);

  // Ref to track the latest ideas for save operations
  const ideasRef = useRef<Idea[]>([]);
  ideasRef.current = ideas;

  // Load persisted data on mount
  useEffect(() => {
    (async () => {
      try {
        let storedIdeas = await loadIdeas();
        const storedVoted = await loadVotedIds();

        // Seed sample data on first launch only
        if (storedIdeas.length === 0 && !(await hasSeeded())) {
          storedIdeas = SEED_IDEAS;
          await saveIdeas(storedIdeas);
          await markSeeded();
        }

        setIdeas(storedIdeas);
        setVotedIds(storedVoted);
      } catch (error) {
        console.error('Initialization error:', error);
        // App starts with empty state if storage fails
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const addIdea = useCallback(async (idea: Idea) => {
    const prevIdeas = ideasRef.current;
    const updated = [idea, ...prevIdeas];
    ideasRef.current = updated;
    setIdeas(updated);
    try {
      await saveIdeas(updated);
    } catch (error) {
      ideasRef.current = prevIdeas;
      setIdeas(prevIdeas);
      throw error;
    }
  }, []);

  const upvoteIdea = useCallback(
    async (id: string): Promise<{ success: boolean; message: string }> => {
      if (votedIds.has(id)) {
        return { success: false, message: 'You have already voted for this idea.' };
      }

      const prevIdeas = ideasRef.current;
      const prevVoted = votedIds;

      const updatedIdeas = prevIdeas.map((idea) =>
        idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
      );
      const updatedVoted = new Set(votedIds);
      updatedVoted.add(id);

      ideasRef.current = updatedIdeas;
      setIdeas(updatedIdeas);
      setVotedIds(updatedVoted);

      try {
        await saveIdeas(updatedIdeas);
        await saveVotedIds(updatedVoted);
        return { success: true, message: 'Vote recorded!' };
      } catch {
        // Rollback on save failure to captured snapshots
        ideasRef.current = prevIdeas;
        setIdeas(prevIdeas);
        setVotedIds(prevVoted);
        return { success: false, message: 'Failed to save your vote. Please try again.' };
      }
    },
    [votedIds]
  );

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const sortIdeas = useCallback((list: Idea[], by: SortOption): Idea[] => {
    return [...list].sort((a, b) => {
      if (by === 'rating') {
        if (b.rating !== a.rating) return b.rating - a.rating;
        if (b.votes !== a.votes) return b.votes - a.votes;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        if (b.votes !== a.votes) return b.votes - a.votes;
        if (b.rating !== a.rating) return b.rating - a.rating;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, []);

  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <AppContext.Provider
      value={{
        ideas,
        votedIds,
        isLoading,
        isDark,
        colors,
        addIdea,
        upvoteIdea,
        toggleDarkMode,
        sortIdeas,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
