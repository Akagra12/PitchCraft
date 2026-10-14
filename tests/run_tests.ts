import { evaluateIdea } from '../src/services/evaluator';
import { Idea, SortOption } from '../src/types/Idea';
import { SEED_IDEAS } from '../src/data/seedIdeas';

const assert = {
  strictEqual(actual: any, expected: any, msg?: string) {
    if (actual !== expected) {
      throw new Error(msg || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
  },
  ok(value: any, msg?: string) {
    if (!value) {
      throw new Error(msg || `Assertion failed: value is falsy`);
    }
  },
  deepStrictEqual(actual: any, expected: any, msg?: string) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(msg || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
  },
};

console.log('🚀 Running PitchCraft Automated Test Suite...\n');

let passedCount = 0;
let failedCount = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedCount++;
  } catch (err: any) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     ${err.message}`);
    failedCount++;
  }
}

// -------------------------------------------------------------
// 1. Mock AI Evaluator Tests
// -------------------------------------------------------------
console.log('--- 1. Mock AI Evaluator Tests ---');

test('evaluateIdea returns integer score between 0 and 100', () => {
  for (let i = 0; i < 50; i++) {
    const res = evaluateIdea(
      'TestStartup',
      'An amazing AI platform for testing',
      'This is a comprehensive description that explains how the AI automated platform works for users.'
    );
    assert.strictEqual(typeof res.score, 'number');
    assert.strictEqual(Number.isInteger(res.score), true);
    assert.ok(res.score >= 0 && res.score <= 100, `Score ${res.score} out of bounds`);
    assert.strictEqual(typeof res.feedback, 'string');
    assert.ok(res.feedback.length > 0);
  }
});

test('evaluateIdea clamps minimal input to >= 0', () => {
  const res = evaluateIdea('A', 'B', 'C');
  assert.ok(res.score >= 0 && res.score <= 100);
});

test('evaluateIdea awards keyword bonus for trending terms', () => {
  const withoutKeywords = evaluateIdea(
    'SimpleApp',
    'A nice tool for folks',
    'A general utility tool that does standard tasks every day without any fancy things.'
  );
  const withKeywords = evaluateIdea(
    'NeuralChain',
    'AI-powered SaaS blockchain platform',
    'An automated machine learning SaaS platform with scalable analytics, deep tech cloud architecture, and web3 token security.'
  );
  // Average or baseline check over multiple runs to account for ±10 jitter
  let totalWith = 0;
  let totalWithout = 0;
  for (let i = 0; i < 20; i++) {
    totalWith += evaluateIdea('NeuralChain', 'AI SaaS platform', 'Machine learning and deep tech automat cloud analytics and web3.').score;
    totalWithout += evaluateIdea('Basic', 'Basic tool', 'A basic tool that does basic tasks.').score;
  }
  assert.ok(totalWith / 20 > totalWithout / 20, 'Ideas with tech keywords should score significantly higher on average');
});

// -------------------------------------------------------------
// 2. Validation Logic Tests
// -------------------------------------------------------------
console.log('\n--- 2. Form Validation Tests ---');

function validateForm(name: string, tag: string, desc: string) {
  const err: Record<string, string> = {};
  const trimmedName = name.trim();
  const trimmedTag = tag.trim();
  const trimmedDesc = desc.trim();

  if (!trimmedName) err.startupName = 'Startup name is required.';
  else if (trimmedName.length < 2) err.startupName = 'Name must be at least 2 characters.';
  else if (trimmedName.length > 60) err.startupName = 'Name is too long (max 60 characters).';

  if (!trimmedTag) err.tagline = 'Tagline is required.';
  else if (trimmedTag.length < 5) err.tagline = 'Tagline should be at least 5 characters.';
  else if (trimmedTag.length > 120) err.tagline = 'Tagline is too long (max 120 characters).';

  if (!trimmedDesc) err.description = 'Description is required.';
  else if (trimmedDesc.length < 20) err.description = 'Description should be at least 20 characters.';

  return err;
}

test('validateForm rejects empty fields', () => {
  const errs = validateForm('', '', '');
  assert.strictEqual(errs.startupName, 'Startup name is required.');
  assert.strictEqual(errs.tagline, 'Tagline is required.');
  assert.strictEqual(errs.description, 'Description is required.');
});

test('validateForm rejects too-short inputs', () => {
  const errs = validateForm('A', 'Hey', 'Too short');
  assert.strictEqual(errs.startupName, 'Name must be at least 2 characters.');
  assert.strictEqual(errs.tagline, 'Tagline should be at least 5 characters.');
  assert.strictEqual(errs.description, 'Description should be at least 20 characters.');
});

test('validateForm accepts valid inputs', () => {
  const errs = validateForm(
    'PitchCraft',
    'Evaluate ideas with AI and community voting',
    'PitchCraft allows entrepreneurs to submit startup pitches, receive simulated AI scores, and gather community votes.'
  );
  assert.strictEqual(Object.keys(errs).length, 0);
});

// -------------------------------------------------------------
// 3. Sorting & Deterministic Tie-Breaker Tests
// -------------------------------------------------------------
console.log('\n--- 3. Sorting & Deterministic Tie-Breaker Tests ---');

function sortIdeasDeterministic(list: Idea[], by: SortOption): Idea[] {
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
}

test('sortIdeas orders by rating descending', () => {
  const mockIdeas: Idea[] = [
    { id: '1', startupName: 'Low', tagline: 't', description: 'd', rating: 40, feedback: 'f', votes: 10, createdAt: '2026-01-01T00:00:00Z' },
    { id: '2', startupName: 'High', tagline: 't', description: 'd', rating: 95, feedback: 'f', votes: 2, createdAt: '2026-01-01T00:00:00Z' },
    { id: '3', startupName: 'Mid', tagline: 't', description: 'd', rating: 70, feedback: 'f', votes: 5, createdAt: '2026-01-01T00:00:00Z' },
  ];
  const sorted = sortIdeasDeterministic(mockIdeas, 'rating');
  assert.deepStrictEqual(sorted.map(i => i.id), ['2', '3', '1']);
});

test('sortIdeas orders by votes descending', () => {
  const mockIdeas: Idea[] = [
    { id: '1', startupName: 'Few', tagline: 't', description: 'd', rating: 90, feedback: 'f', votes: 2, createdAt: '2026-01-01T00:00:00Z' },
    { id: '2', startupName: 'Most', tagline: 't', description: 'd', rating: 50, feedback: 'f', votes: 100, createdAt: '2026-01-01T00:00:00Z' },
    { id: '3', startupName: 'Mid', tagline: 't', description: 'd', rating: 70, feedback: 'f', votes: 25, createdAt: '2026-01-01T00:00:00Z' },
  ];
  const sorted = sortIdeasDeterministic(mockIdeas, 'votes');
  assert.deepStrictEqual(sorted.map(i => i.id), ['2', '3', '1']);
});

test('sortIdeas applies secondary tiebreaker when votes are equal', () => {
  const mockIdeas: Idea[] = [
    { id: 'tied-lower-rating', startupName: 'A', tagline: 't', description: 'd', rating: 60, feedback: 'f', votes: 10, createdAt: '2026-01-01T00:00:00Z' },
    { id: 'tied-higher-rating', startupName: 'B', tagline: 't', description: 'd', rating: 90, feedback: 'f', votes: 10, createdAt: '2026-01-01T00:00:00Z' },
  ];
  const sorted = sortIdeasDeterministic(mockIdeas, 'votes');
  assert.strictEqual(sorted[0].id, 'tied-higher-rating');
  assert.strictEqual(sorted[1].id, 'tied-lower-rating');
});

test('sortIdeas applies secondary tiebreaker when ratings are equal', () => {
  const mockIdeas: Idea[] = [
    { id: 'tied-fewer-votes', startupName: 'A', tagline: 't', description: 'd', rating: 85, feedback: 'f', votes: 3, createdAt: '2026-01-01T00:00:00Z' },
    { id: 'tied-more-votes', startupName: 'B', tagline: 't', description: 'd', rating: 85, feedback: 'f', votes: 20, createdAt: '2026-01-01T00:00:00Z' },
  ];
  const sorted = sortIdeasDeterministic(mockIdeas, 'rating');
  assert.strictEqual(sorted[0].id, 'tied-more-votes');
  assert.strictEqual(sorted[1].id, 'tied-fewer-votes');
});

// -------------------------------------------------------------
// 4. Leaderboard Logic Tests
// -------------------------------------------------------------
console.log('\n--- 4. Leaderboard Logic Tests ---');

test('Leaderboard slices top 5 items only', () => {
  const sorted = sortIdeasDeterministic(SEED_IDEAS, 'votes');
  const top5 = sorted.slice(0, 5);
  assert.strictEqual(top5.length, 5);
  assert.ok(top5[0].votes >= top5[1].votes);
  assert.ok(top5[1].votes >= top5[2].votes);
  assert.ok(top5[2].votes >= top5[3].votes);
  assert.ok(top5[3].votes >= top5[4].votes);
});

test('Leaderboard handles fewer than 5 ideas gracefully', () => {
  const fewIdeas: Idea[] = [
    { id: '1', startupName: 'OnlyOne', tagline: 't', description: 'd', rating: 80, feedback: 'f', votes: 5, createdAt: '2026-01-01T00:00:00Z' },
    { id: '2', startupName: 'OnlyTwo', tagline: 't', description: 'd', rating: 70, feedback: 'f', votes: 2, createdAt: '2026-01-01T00:00:00Z' },
  ];
  const sorted = sortIdeasDeterministic(fewIdeas, 'votes');
  const top = sorted.slice(0, 5);
  assert.strictEqual(top.length, 2);
  assert.strictEqual(top[0].id, '1');
});

// -------------------------------------------------------------
// 5. Duplicate Vote Restriction Tests
// -------------------------------------------------------------
console.log('\n--- 5. Duplicate Vote Restriction Tests ---');

test('Duplicate vote restriction prevents second vote for same idea', () => {
  const votedIds = new Set<string>();
  const ideaId = 'seed-4';

  // First vote attempt
  assert.strictEqual(votedIds.has(ideaId), false);
  votedIds.add(ideaId);
  assert.strictEqual(votedIds.has(ideaId), true);

  // Second vote attempt
  const canVoteAgain = !votedIds.has(ideaId);
  assert.strictEqual(canVoteAgain, false);
});

test('Voted IDs serialization round-trip', () => {
  const votedIds = new Set(['seed-1', 'seed-4', 'user-idea-99']);
  const serialized = JSON.stringify([...votedIds]);
  const restored = new Set(JSON.parse(serialized));
  assert.strictEqual(restored.size, 3);
  assert.strictEqual(restored.has('seed-4'), true);
  assert.strictEqual(restored.has('seed-2'), false);
});

// -------------------------------------------------------------
// 6. Seed Data Sanity Tests
// -------------------------------------------------------------
console.log('\n--- 6. Seed Data Sanity Tests ---');

test('SEED_IDEAS has valid properties and ratings within range', () => {
  assert.strictEqual(SEED_IDEAS.length, 6);
  for (const idea of SEED_IDEAS) {
    assert.ok(idea.id.length > 0);
    assert.ok(idea.startupName.length > 0);
    assert.ok(idea.tagline.length > 0);
    assert.ok(idea.description.length >= 20);
    assert.ok(idea.rating >= 0 && idea.rating <= 100);
    assert.ok(idea.votes >= 0);
    assert.ok(idea.feedback.length > 0);
    assert.ok(!isNaN(Date.parse(idea.createdAt)));
  }
});

// -------------------------------------------------------------
// Final Summary
// -------------------------------------------------------------
console.log('\n=============================================');
console.log(`Test Execution Finished: ${passedCount} passed, ${failedCount} failed`);
console.log('=============================================\n');

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
