import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { evaluateIdea } from '../services/evaluator';
import { Idea } from '../types/Idea';
import Toast from '../components/Toast';
import ScoreBadge from '../components/ScoreBadge';
import { Spacing, FontSize, Radius, Shadow } from '../theme/theme';

// Simple unique ID generator — no external dependency needed
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

interface ValidationErrors {
  startupName?: string;
  tagline?: string;
  description?: string;
}

export default function CreateScreen({ navigation }: { navigation: any }) {
  const { addIdea, colors } = useApp();
  const [startupName, setStartupName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' });

  // Refs to prevent double-submit and track navigation timer
  const submittingRef = useRef(false);
  const taglineRef = useRef<TextInput>(null);
  const descRef = useRef<TextInput>(null);
  const navTimerRef = useRef<any>(null);

  React.useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ visible: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  function validate(): ValidationErrors {
    const err: ValidationErrors = {};
    const name = startupName.trim();
    const tag = tagline.trim();
    const desc = description.trim();

    if (!name) err.startupName = 'Startup name is required.';
    else if (name.length < 2) err.startupName = 'Name must be at least 2 characters.';
    else if (name.length > 60) err.startupName = 'Name is too long (max 60 characters).';

    if (!tag) err.tagline = 'Tagline is required.';
    else if (tag.length < 5) err.tagline = 'Tagline should be at least 5 characters.';
    else if (tag.length > 120) err.tagline = 'Tagline is too long (max 120 characters).';

    if (!desc) err.description = 'Description is required.';
    else if (desc.length < 20) err.description = 'Description should be at least 20 characters.';

    return err;
  }

  const handleSubmit = useCallback(async () => {
    // Prevent double-tap
    if (submittingRef.current) return;

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      // Generate mock AI evaluation
      const evaluation = evaluateIdea(startupName.trim(), tagline.trim(), description.trim());
      setResult(evaluation);

      const newIdea: Idea = {
        id: generateId(),
        startupName: startupName.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        rating: evaluation.score,
        feedback: evaluation.feedback,
        votes: 0,
        createdAt: new Date().toISOString(),
      };

      await addIdea(newIdea);
      showToast('Idea submitted successfully! 🎉', 'success');

      // Brief delay to let user see the score, then navigate
      navTimerRef.current = setTimeout(() => {
        setStartupName('');
        setTagline('');
        setDescription('');
        setErrors({});
        setResult(null);
        submittingRef.current = false;
        navigation.navigate('Ideas');
      }, 2000);
    } catch (error) {
      showToast('Failed to save your idea. Please try again.', 'error');
      submittingRef.current = false;
    } finally {
      setIsSubmitting(false);
    }
  }, [startupName, tagline, description, addIdea, navigation, showToast]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Pitch Your Idea</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Submit your startup concept and get an instant AI-style evaluation.
            </Text>
          </View>

          {/* Form */}
          <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }, Shadow.card]}>
            {/* Startup Name */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>Startup Name *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.background,
                  borderColor: errors.startupName ? colors.error : colors.border,
                },
              ]}
              placeholder="e.g., EcoTrack"
              placeholderTextColor={colors.textTertiary}
              value={startupName}
              onChangeText={(text) => {
                setStartupName(text);
                if (errors.startupName) setErrors((prev) => ({ ...prev, startupName: undefined }));
              }}
              returnKeyType="next"
              onSubmitEditing={() => taglineRef.current?.focus()}
              maxLength={60}
            />
            {errors.startupName && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.startupName}</Text>
            )}

            {/* Tagline */}
            <Text style={[styles.label, { color: colors.textSecondary, marginTop: Spacing.lg }]}>
              Tagline *
            </Text>
            <TextInput
              ref={taglineRef}
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.background,
                  borderColor: errors.tagline ? colors.error : colors.border,
                },
              ]}
              placeholder="A catchy one-liner for your startup"
              placeholderTextColor={colors.textTertiary}
              value={tagline}
              onChangeText={(text) => {
                setTagline(text);
                if (errors.tagline) setErrors((prev) => ({ ...prev, tagline: undefined }));
              }}
              returnKeyType="next"
              onSubmitEditing={() => descRef.current?.focus()}
              maxLength={120}
            />
            {errors.tagline && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.tagline}</Text>
            )}

            {/* Description */}
            <Text style={[styles.label, { color: colors.textSecondary, marginTop: Spacing.lg }]}>
              Description *
            </Text>
            <TextInput
              ref={descRef}
              style={[
                styles.input,
                styles.textArea,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.background,
                  borderColor: errors.description ? colors.error : colors.border,
                },
              ]}
              placeholder="Describe your startup idea in detail — what problem does it solve? Who is it for?"
              placeholderTextColor={colors.textTertiary}
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
            {errors.description && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.description}</Text>
            )}

            {/* Submit button */}
            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.submitBtn, { backgroundColor: colors.accent, opacity: isSubmitting ? 0.7 : 1 }]}
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="rocket" size={20} color="#FFFFFF" />
                  <Text style={styles.submitText}>Evaluate & Submit</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Result card */}
          {result && (
            <View
              style={[
                styles.resultCard,
                { backgroundColor: colors.surface, borderColor: colors.accent },
                Shadow.elevated,
              ]}
            >
              <Text style={[styles.resultTitle, { color: colors.textPrimary }]}>
                Mock AI Evaluation
              </Text>
              <View style={styles.resultRow}>
                <ScoreBadge score={result.score} size="lg" />
                <View style={styles.resultText}>
                  <Text style={[styles.resultScore, { color: colors.accent }]}>
                    Score: {result.score}/100
                  </Text>
                  <Text style={[styles.resultFeedback, { color: colors.textSecondary }]}>
                    {result.feedback}
                  </Text>
                </View>
              </View>
              <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>
                This is a simulated AI score for demonstration purposes.
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 120,
  },
  header: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
    lineHeight: 22,
  },
  formCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.xl,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
  },
  textArea: {
    minHeight: 120,
    paddingTop: Spacing.md,
  },
  errorText: {
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
    fontWeight: '500',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: Radius.md,
    marginTop: Spacing.xxl,
    gap: Spacing.sm,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  resultCard: {
    borderRadius: Radius.lg,
    borderWidth: 2,
    padding: Spacing.xl,
    marginTop: Spacing.xxl,
  },
  resultTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  resultText: {
    flex: 1,
  },
  resultScore: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  resultFeedback: {
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
    lineHeight: 22,
  },
  disclaimer: {
    fontSize: FontSize.xs,
    marginTop: Spacing.md,
    fontStyle: 'italic',
  },
});
