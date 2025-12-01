export const ONBOARDING_SIMPLIFIED_CONFIG = {
  TOTAL_STEPS: 9,
  STEPS: {
    WELCOME: 1,
    NAME: 2,
    QUESTIONNAIRE: 3,
    MOTIVATION: 4,
    CIGARETTES: 5,
    PRICE: 6,
    PACK_SIZE: 7,
    READY: 8,
    SUPPORT: 9,
  },
} as const;

export type OnboardingSimplifiedStep =
  (typeof ONBOARDING_SIMPLIFIED_CONFIG.STEPS)[keyof typeof ONBOARDING_SIMPLIFIED_CONFIG.STEPS];
