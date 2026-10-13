import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Idea } from '../types/Idea';
import { useApp } from '../context/AppContext';
import ScoreBadge from './ScoreBadge';
import { Spacing, FontSize, Radius, Shadow } from '../theme/theme';

interface IdeaCardProps {
  idea: Idea;
  onVote: (id: string) => void;
  hasVoted: boolean;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function IdeaCard({ idea, onVote, hasVoted, showToast }: IdeaCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { colors } = useApp();

  const handleShare = useCallback(async () => {
    const text = `🚀 ${idea.startupName}\n"${idea.tagline}"\n\nMock AI Score: ${idea.rating}/100\nVotes: ${idea.votes}\n\n${idea.description}\n\n— Shared via PitchCraft`;
    try {
      if (Platform.OS === 'web') {
        await Clipboard.setStringAsync(text);
        showToast('Copied to clipboard!', 'success');
      } else {
        await Share.share({ message: text });
      }
    } catch {
      // User cancelled the share sheet — not an error
    }
  }, [idea, showToast]);

  const formattedDate = new Date(idea.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, Shadow.card]}>
      {/* Header row */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
            {idea.startupName}
          </Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]} numberOfLines={2}>
            {idea.tagline}
          </Text>
        </View>
        <ScoreBadge score={idea.rating} size="md" />
      </View>

      {/* Feedback */}
      <View style={[styles.feedbackRow, { backgroundColor: colors.accentDim }]}>
        <Text style={[styles.feedbackLabel, { color: colors.accent }]}>Mock AI Feedback</Text>
        <Text style={[styles.feedback, { color: colors.textSecondary }]}>{idea.feedback}</Text>
      </View>

      {/* Expandable description */}
      <TouchableOpacity
        onPress={() => setExpanded((prev) => !prev)}
        activeOpacity={0.7}
        style={styles.readMore}
      >
        <Text
          style={[styles.description, { color: colors.textSecondary }]}
          numberOfLines={expanded ? undefined : 2}
        >
          {idea.description}
        </Text>
        <Text style={[styles.readMoreText, { color: colors.accent }]}>
          {expanded ? 'Show less' : 'Read more'}
        </Text>
      </TouchableOpacity>

      {/* Footer: vote + share + date */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => onVote(idea.id)}
          style={[
            styles.voteBtn,
            {
              backgroundColor: hasVoted ? colors.accentDim : colors.accent,
              opacity: hasVoted ? 0.8 : 1,
            },
          ]}
          activeOpacity={0.7}
          disabled={hasVoted}
        >
          <Ionicons
            name={hasVoted ? 'checkmark-circle' : 'arrow-up-circle'}
            size={18}
            color={hasVoted ? colors.accent : '#FFFFFF'}
          />
          <Text
            style={[
              styles.voteBtnText,
              { color: hasVoted ? colors.accent : '#FFFFFF' },
            ]}
          >
            {hasVoted ? 'Voted' : 'Upvote'}
          </Text>
          <Text
            style={[
              styles.voteCount,
              { color: hasVoted ? colors.accent : 'rgba(255,255,255,0.85)' },
            ]}
          >
            {idea.votes}
          </Text>
        </TouchableOpacity>

        <View style={styles.footerRight}>
          <TouchableOpacity onPress={handleShare} style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.date, { color: colors.textTertiary }]}>{formattedDate}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  tagline: {
    fontSize: FontSize.sm,
    marginTop: 2,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  feedbackRow: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.sm,
  },
  feedbackLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  feedback: {
    fontSize: FontSize.sm,
    lineHeight: 18,
  },
  readMore: {
    marginTop: Spacing.md,
  },
  description: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  readMoreText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
  voteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    gap: 6,
  },
  voteBtnText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  voteCount: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBtn: {
    padding: Spacing.xs,
  },
  date: {
    fontSize: FontSize.xs,
  },
});
