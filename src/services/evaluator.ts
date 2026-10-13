/**
 * Mock AI Evaluator Service
 *
 * Generates a simulated "AI score" (0–100) and a feedback sentence for a startup idea.
 * This does NOT call any real AI API — it uses keyword matching, content length checks,
 * and a small random component to produce a fun, explainable score.
 *
 * HOW IT WORKS:
 * 1. Base score from content quality (length, detail, completeness)
 * 2. Bonus for buzzword / trend keywords
 * 3. Bonus for clear, descriptive tagline
 * 4. Small random ±10 jitter so every submission feels unique
 * 5. Clamped to 0–100
 */

interface EvaluationResult {
  score: number;
  feedback: string;
}

// Keywords that bump the score — things investors like to hear
const TRENDING_KEYWORDS = [
  'ai', 'machine learning', 'blockchain', 'saas', 'fintech', 'healthtech',
  'edtech', 'sustainability', 'green', 'renewable', 'marketplace', 'platform',
  'automat', 'cloud', 'data', 'analytics', 'iot', 'mobile', 'app', 'social',
  'community', 'subscription', 'recurring', 'scalab', 'disrupt', 'innovat',
  'personali', 'smart', 'digital', 'transform', 'remote', 'decentral',
  'cyber', 'api', 'open source', 'b2b', 'b2c', 'ecommerce', 'logistics',
  'supply chain', 'deep tech', 'quantum', 'robotics', 'augmented', 'virtual',
  'metaverse', 'web3', 'nft', 'token', 'gamif', 'crm', 'erp',
];

// Feedback templates keyed by score tier
const FEEDBACK_TIERS: { min: number; messages: string[] }[] = [
  {
    min: 85,
    messages: [
      '🚀 This idea has serious potential! Investors would pay attention.',
      '🔥 Strong concept with a clear value proposition — keep refining!',
      '💎 Diamond in the rough — this could disrupt the market.',
      '⭐ Exceptional pitch! The detail and clarity are impressive.',
    ],
  },
  {
    min: 70,
    messages: [
      '👍 Solid idea! A bit more specificity would push it higher.',
      '💡 Good foundation — consider how you\'d differentiate from competitors.',
      '📈 Promising concept with room to grow. Flesh out the details!',
      '🎯 You\'re onto something. Sharpen the tagline for maximum impact.',
    ],
  },
  {
    min: 50,
    messages: [
      '🤔 Interesting concept, but the description could use more depth.',
      '📝 Decent start — try adding specifics about your target audience.',
      '💬 The idea has merit. A clearer tagline would help it stand out.',
      '🔍 There\'s potential here. More detail would strengthen the pitch.',
    ],
  },
  {
    min: 30,
    messages: [
      '📋 The basics are there, but this needs a lot more detail.',
      '✏️ Consider expanding your description — what problem does this solve?',
      '🧩 The concept is vague. Try being more specific about the product.',
      '📄 Needs work. Focus on what makes your idea unique.',
    ],
  },
  {
    min: 0,
    messages: [
      '⚠️ Very sparse submission. Add a real description to get a better score.',
      '📝 Almost empty — tell us what your startup actually does!',
      '🔧 Needs significant improvement. Fill in all the fields thoroughly.',
      '❓ Hard to evaluate without more information. Please elaborate!',
    ],
  },
];

function countKeywordHits(text: string): number {
  const lower = text.toLowerCase();
  let hits = 0;
  for (const kw of TRENDING_KEYWORDS) {
    if (lower.includes(kw)) hits++;
  }
  return hits;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Evaluate a startup idea and return a mock AI score + feedback.
 */
export function evaluateIdea(
  startupName: string,
  tagline: string,
  description: string
): EvaluationResult {
  let score = 0;

  // --- 1. Content completeness (0–30 points) ---
  const descWords = wordCount(description);
  if (descWords >= 50) score += 30;
  else if (descWords >= 30) score += 22;
  else if (descWords >= 15) score += 14;
  else if (descWords >= 5) score += 7;

  // --- 2. Tagline quality (0–15 points) ---
  const tagWords = wordCount(tagline);
  if (tagWords >= 4 && tagWords <= 12) score += 15;
  else if (tagWords >= 2) score += 8;
  else if (tagWords >= 1) score += 3;

  // --- 3. Name quality (0–10 points) ---
  const nameLen = startupName.trim().length;
  if (nameLen >= 3 && nameLen <= 30) score += 10;
  else if (nameLen >= 1) score += 4;

  // --- 4. Keyword / trend bonus (0–20 points) ---
  const allText = `${startupName} ${tagline} ${description}`;
  const hits = countKeywordHits(allText);
  score += Math.min(hits * 4, 20);

  // --- 5. Description has sentences / punctuation (0–10 points) ---
  const sentenceEnders = (description.match(/[.!?]/g) || []).length;
  if (sentenceEnders >= 3) score += 10;
  else if (sentenceEnders >= 1) score += 5;

  // --- 6. Random jitter ±10 ---
  const jitter = Math.floor(Math.random() * 21) - 10; // -10 to +10
  score += jitter;

  // Clamp to 0–100
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Pick feedback message
  const tier = FEEDBACK_TIERS.find((t) => score >= t.min) || FEEDBACK_TIERS[FEEDBACK_TIERS.length - 1];
  const feedback = tier.messages[Math.floor(Math.random() * tier.messages.length)];

  return { score, feedback };
}
