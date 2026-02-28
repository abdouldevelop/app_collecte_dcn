import { Easing } from 'react-native-reanimated';

// ============================================================
// ANIMATION SYSTEM - APP COLLECTE
// Standards: Material Design 3 Motion
// 60fps smooth, spring-based, purposeful
// ============================================================

// --- SPRING CONFIGS ---
export const springs = {
  /** Transitions douces, menus, overlays */
  gentle: { damping: 20, stiffness: 120, mass: 1 },
  /** Boutons, toggles, selection */
  bouncy: { damping: 12, stiffness: 180, mass: 0.8 },
  /** Fermeture, snap, validation */
  stiff: { damping: 26, stiffness: 300, mass: 1 },
  /** Entrees de page, parallax */
  slow: { damping: 20, stiffness: 80, mass: 1.2 },
  /** Micro-feedback au press */
  snappy: { damping: 15, stiffness: 400, mass: 0.6 },
} as const;

// --- TIMING DURATIONS ---
export const durations = {
  instant: 100,
  fast: 150,
  normal: 250,
  slow: 400,
  emphasis: 500,
  pageTransition: 350,
} as const;

// --- EASING CURVES (Material Design 3) ---
export const easings = {
  /** Standard curve - most transitions */
  standard: Easing.bezier(0.2, 0, 0, 1),
  /** Decelerate - elements entering */
  decelerate: Easing.bezier(0, 0, 0, 1),
  /** Accelerate - elements exiting */
  accelerate: Easing.bezier(0.3, 0, 1, 1),
  /** Emphasized - important transitions */
  emphasized: Easing.bezier(0.2, 0, 0, 1),
  /** Linear - progress bars, loaders */
  linear: Easing.linear,
} as const;

// --- STAGGER DELAYS (pour listes animees) ---
export const stagger = {
  /** Delai entre chaque item de liste */
  listItem: 50,
  /** Delai entre les cartes */
  card: 80,
  /** Delai pour les sections */
  section: 120,
} as const;

// --- SCALE PRESETS ---
export const scalePresets = {
  /** Press effect sur boutons */
  buttonPress: 0.97,
  /** Press effect sur cartes */
  cardPress: 0.98,
  /** Press effect sur items de liste */
  listItemPress: 0.99,
  /** Effet de sursaut */
  bounce: 1.05,
  /** Apparition d'element */
  popIn: { from: 0.8, to: 1 },
} as const;

// --- ENTER/EXIT ANIMATION CONFIGS ---
export const enterAnimations = {
  fadeInUp: {
    entering: 'FadeInUp',
    duration: 400,
    springify: true,
    damping: 18,
  },
  fadeInDown: {
    entering: 'FadeInDown',
    duration: 400,
    springify: true,
    damping: 16,
  },
  slideInRight: {
    entering: 'SlideInRight',
    duration: 350,
    springify: true,
    damping: 20,
  },
  scaleIn: {
    entering: 'ZoomIn',
    duration: 300,
    springify: true,
    damping: 14,
  },
} as const;

// --- SHIMMER ANIMATION (pour skeleton loading) ---
export const shimmer = {
  duration: 1500,
  delay: 0,
} as const;
