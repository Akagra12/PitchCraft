import AsyncStorage from '@react-native-async-storage/async-storage';
import { Idea } from '../types/Idea';

const IDEAS_KEY = '@pitchcraft_ideas';
const VOTED_KEY = '@pitchcraft_voted_ids';
const SEEDED_KEY = '@pitchcraft_seeded';

/**
 * Load all saved ideas from AsyncStorage.
 */
export async function loadIdeas(): Promise<Idea[]> {
  try {
    const json = await AsyncStorage.getItem(IDEAS_KEY);
    if (json) return JSON.parse(json) as Idea[];
    return [];
  } catch (error) {
    console.error('Failed to load ideas:', error);
    throw new Error('Could not load saved ideas. Please restart the app.');
  }
}

/**
 * Save the full list of ideas to AsyncStorage.
 */
export async function saveIdeas(ideas: Idea[]): Promise<void> {
  try {
    await AsyncStorage.setItem(IDEAS_KEY, JSON.stringify(ideas));
  } catch (error) {
    console.error('Failed to save ideas:', error);
    throw new Error('Could not save ideas. Storage may be full.');
  }
}

/**
 * Load the set of idea IDs the user has already voted on.
 */
export async function loadVotedIds(): Promise<Set<string>> {
  try {
    const json = await AsyncStorage.getItem(VOTED_KEY);
    if (json) return new Set(JSON.parse(json) as string[]);
    return new Set();
  } catch (error) {
    console.error('Failed to load voted IDs:', error);
    throw new Error('Could not load voting data.');
  }
}

/**
 * Save the set of voted idea IDs.
 */
export async function saveVotedIds(ids: Set<string>): Promise<void> {
  try {
    await AsyncStorage.setItem(VOTED_KEY, JSON.stringify([...ids]));
  } catch (error) {
    console.error('Failed to save voted IDs:', error);
    throw new Error('Could not save your vote. Please try again.');
  }
}

/**
 * Check whether seed data has already been added.
 */
export async function hasSeeded(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(SEEDED_KEY);
    return val === 'true';
  } catch {
    return false;
  }
}

/**
 * Mark that seed data has been written.
 */
export async function markSeeded(): Promise<void> {
  try {
    await AsyncStorage.setItem(SEEDED_KEY, 'true');
  } catch {
    // Non-critical — seed may reappear on next fresh start
  }
}
