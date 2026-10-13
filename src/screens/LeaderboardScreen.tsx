import React, { useState, useMemo } from 'react';
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
import { RankMode } from '../types/Idea';
import ScoreBadge from '../components/ScoreBadge';
import EmptyState from '../components/EmptyState';
import { Spacing, FontSize, Radius, Shadow } from '../theme/theme';

const RANK_EMOJIS = ['🥇', '🥈', '🥉'];
const MAX_LEADERS = 5;

export default function LeaderboardScreen() {
  const { ideas, isLoading, colors, sortIdeas } = useApp();
  const [rankBy, setRankBy] = useState<RankMode>('votes');

  const topIdeas = useMemo(() => {
    const sorted = sortIdeas(ideas, rankBy);
    return sorted.slice(0, MAX_LEADERS);
  }, [ideas, rankBy, sortIdeas]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Leaderboard</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Top {Math.min(topIdeas.length, MAX_LEADERS)} startup ideas
          </Text>
        </View>
        <Ionicons name="trophy" size={28} color={colors.gold} />
      </View>

      {/* Rank mode toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          onPress={() => setRankBy('votes')}
          style={[
            styles.toggleBtn,
            {
              backgroundColor: rankBy === 'votes' ? colors.accent : colors.surface,
              borderColor: rankBy === 'votes' ? colors.accent : colors.border,
            },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-up-circle"
            size={16}
            color={rankBy === 'votes' ? '#FFFFFF' : colors.textSecondary}
          />
          <Text
            style={[
              styles.toggleText,
              { color: rankBy === 'votes' ? '#FFFFFF' : colors.textSecondary },
            ]}
          >
            By Votes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRankBy('rating')}
          style={[
            styles.toggleBtn,
            {
              backgroundColor: rankBy === 'rating' ? colors.accent : colors.surface,
              borderColor: rankBy === 'rating' ? colors.accent : colors.border,
            },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons
            name="star"
            size={16}
            color={rankBy === 'rating' ? '#FFFFFF' : colors.textSecondary}
          />
          <Text
            style={[
              styles.toggleText,
              { color: rankBy === 'rating' ? '#FFFFFF' : colors.textSecondary },
            ]}
          >
            By Rating
          </Text>
        </TouchableOpacity>
      </View>

      {/* Leaderboard list */}
      {topIdeas.length === 0 ? (
        <EmptyState
          icon="trophy-outline"
          title="No ideas to rank yet"
          subtitle="Submit some startup ideas to see them compete on the leaderboard!"
        />
      ) : (
        <FlatList
          data={topIdeas}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <LeaderCard
              idea={item}
              rank={index + 1}
              rankBy={rankBy}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

/** Individual leaderboard card with rank badge and highlight for top 3. */
function LeaderCard({
  idea,
  rank,
  rankBy,
}: {
  idea: { startupName: string; tagline: string; rating: number; votes: number; feedback: string };
  rank: number;
  rankBy: RankMode;
}) {
  const { colors } = useApp();
  const isTop3 = rank <= 3;

  const badgeColor =
    rank === 1 ? colors.gold :
    rank === 2 ? colors.silver :
    rank === 3 ? colors.bronze :
    colors.textTertiary;

  const borderHighlight = isTop3 ? badgeColor : colors.border;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: borderHighlight,
          borderWidth: isTop3 ? 1.5 : 1,
        },
        Shadow.card,
      ]}
    >
      <View style={styles.cardContent}>
        {/* Rank badge */}
        <View style={[styles.rankBadge, { backgroundColor: isTop3 ? badgeColor : colors.surfaceElevated }]}>
          {isTop3 ? (
            <Text style={styles.rankEmoji}>{RANK_EMOJIS[rank - 1]}</Text>
          ) : (
            <Text style={[styles.rankNumber, { color: colors.textSecondary }]}>#{rank}</Text>
          )}
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <Text style={[styles.cardName, { color: colors.textPrimary }]} numberOfLines={1}>
            {idea.startupName}
          </Text>
          <Text style={[styles.cardTagline, { color: colors.textSecondary }]} numberOfLines={1}>
            {idea.tagline}
          </Text>
          <Text style={[styles.cardFeedback, { color: colors.textTertiary }]} numberOfLines={1}>
            {idea.feedback}
          </Text>
        </View>

        {/* Score + Votes */}
        <View style={styles.cardStats}>
          <ScoreBadge score={idea.rating} size="sm" />
          <View style={styles.voteStat}>
            <Ionicons name="arrow-up" size={12} color={colors.textSecondary} />
            <Text style={[styles.voteStatText, { color: colors.textSecondary }]}>
              {idea.votes}
            </Text>
          </View>
        </View>
      </View>

      {/* Highlight bar for top 3 */}
      {isTop3 && (
        <View style={[styles.highlightBar, { backgroundColor: badgeColor }]} />
      )}
    </View>
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
  toggleRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.full,
    borderWidth: 1,
    gap: 6,
  },
  toggleText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },
  card: {
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  rankBadge: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankEmoji: {
    fontSize: 20,
  },
  rankNumber: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  cardTagline: {
    fontSize: FontSize.sm,
    marginTop: 2,
    fontStyle: 'italic',
  },
  cardFeedback: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  cardStats: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  voteStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  voteStatText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  highlightBar: {
    height: 3,
  },
});
