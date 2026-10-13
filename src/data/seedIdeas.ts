import { Idea } from '../types/Idea';

/**
 * Sample startup ideas that are seeded on first launch
 * so the listing and leaderboard aren't empty during a demo.
 * These are only inserted when storage is empty.
 */
export const SEED_IDEAS: Idea[] = [
  {
    id: 'seed-1',
    startupName: 'EcoTrack',
    tagline: 'Track your carbon footprint with AI insights',
    description:
      'EcoTrack is a sustainability platform that helps individuals and small businesses monitor their daily carbon emissions. Using smart data analytics and personalized recommendations, it suggests actionable steps to reduce environmental impact. The app integrates with utility providers, transportation APIs, and shopping data to give a holistic view of your carbon footprint.',
    rating: 82,
    feedback: '🚀 This idea has serious potential! Investors would pay attention.',
    votes: 12,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'seed-2',
    startupName: 'MentorMatch',
    tagline: 'Connecting aspiring founders with experienced mentors',
    description:
      'MentorMatch is a B2B SaaS marketplace that pairs early-stage startup founders with seasoned entrepreneurs and industry experts. Using a smart matching algorithm based on domain expertise, availability, and mentoring style, it facilitates meaningful one-on-one sessions. The platform includes scheduling, video calls, and progress tracking.',
    rating: 76,
    feedback: '💡 Good foundation — consider how you\'d differentiate from competitors.',
    votes: 8,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'seed-3',
    startupName: 'QuickBite',
    tagline: 'Meal prep delivery for busy professionals',
    description:
      'QuickBite delivers pre-portioned, healthy meal-prep kits designed for professionals who want to eat well but don\'t have time to cook from scratch. Each kit comes with fresh ingredients and a 15-minute recipe card. Subscriptions can be customized by dietary preference, and the app tracks nutrition goals over time.',
    rating: 64,
    feedback: '📈 Promising concept with room to grow. Flesh out the details!',
    votes: 15,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'seed-4',
    startupName: 'CodeBuddy',
    tagline: 'AI-powered pair programming for students',
    description:
      'CodeBuddy is an edtech platform that provides real-time AI coding assistance to computer science students. It explains errors in plain language, suggests improvements, and adapts to each student\'s skill level. Professors can set up assignments and track student progress through an analytics dashboard.',
    rating: 88,
    feedback: '⭐ Exceptional pitch! The detail and clarity are impressive.',
    votes: 20,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'seed-5',
    startupName: 'PetPal',
    tagline: 'Smart health monitoring for your pets',
    description:
      'PetPal is a mobile app and IoT collar that tracks your pet\'s activity, sleep patterns, and vital signs in real time. It sends alerts when anomalies are detected and provides vet-approved health tips. The subscription includes access to virtual veterinary consultations for quick peace of mind.',
    rating: 71,
    feedback: '🎯 You\'re onto something. Sharpen the tagline for maximum impact.',
    votes: 6,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'seed-6',
    startupName: 'SkillSwap',
    tagline: 'Trade skills, not money — a barter platform for freelancers',
    description:
      'SkillSwap lets freelancers exchange services without money changing hands. A graphic designer can trade logo work for a developer\'s website build. The platform handles skill matching, time tracking, and dispute resolution, creating a community where talent is the currency.',
    rating: 58,
    feedback: '🔍 There\'s potential here. More detail would strengthen the pitch.',
    votes: 3,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
