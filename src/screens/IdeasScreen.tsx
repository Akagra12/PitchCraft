import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { SortOption } from '../types/Idea';
import IdeaCard from '../components/IdeaCard';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import { Spacing, FontSize, Radius } from '../theme/theme';

export default function IdeasScreen() {
  const { ideas, votedIds, isLoading, colors, upvoteIdea, sortIdeas, isDark, toggleDarkMode } = useApp();
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' });

  const sortedIdeas = useMemo(() => sortIdeas(ideas, sortBy), [ideas, sortBy, sortIdeas]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ visible: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleVote = useCallback(
    async (id: string) => {
      const result = await upvoteIdea(id);
      showToast(result.message, result.success ? 'success' : 'error');
    },
    [upvoteIdea, showToast]
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>PitchCraft</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {ideas.length} startup {ideas.length === 1 ? 'idea' : 'ideas'}
          </Text>
        </View>
        <TouchableOpacity onPress={toggleDarkMode} style={styles.themeBtn} activeOpacity={0.7}>
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={22}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Sort bar */}
      {ideas.length > 0 && (
        <View style={styles.sortBar}>
          <Text style={[styles.sortLabel, { color: colors.textTertiary }]}>Sort by</Text>
          <TouchableOpacity
            onPress={() => setSortBy('rating')}
            style={[
              styles.sortBtn,
              {
                backgroundColor: sortBy === 'rating' ? colors.accent : colors.surface,
                borderColor: sortBy === 'rating' ? colors.accent : colors.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Ionicons
              name="star"
              size={14}
              color={sortBy === 'rating' ? '#FFFFFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.sortBtnText,
                { color: sortBy === 'rating' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              Rating
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSortBy('votes')}
            style={[
              styles.sortBtn,
              {
                backgroundColor: sortBy === 'votes' ? colors.accent : colors.surface,
                borderColor: sortBy === 'votes' ? colors.accent : colors.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-up"
              size={14}
              color={sortBy === 'votes' ? '#FFFFFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.sortBtnText,
                { color: sortBy === 'votes' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              Votes
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Idea list */}
      {ideas.length === 0 ? (
        <EmptyState
          icon="bulb-outline"
          title="No ideas yet"
          subtitle="Be the first to pitch a startup idea! Tap the Create tab below."
        />
      ) : (
        <FlatList
          data={sortedIdeas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <IdeaCard
              idea={item}
              onVote={handleVote}
              hasVoted={votedIds.has(item.id)}
              showToast={showToast}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  themeBtn: {
    padding: Spacing.sm,
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  sortLabel: {
    fontSize: FontSize.sm,
    marginRight: Spacing.xs,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1,
    gap: 4,
  },
  sortBtnText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },
});
