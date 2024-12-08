export enum SubscriptionTier {
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE'
}

export const SUBSCRIPTION_TIERS = {
  [SubscriptionTier.STARTER]: {
    name: 'Starter',
    pricePerSeat: 15,
    description: 'Perfect for small teams getting started',
  },
  [SubscriptionTier.PROFESSIONAL]: {
    name: 'Professional',
    pricePerSeat: 25,
    description: 'Advanced features for growing businesses',
  },
  [SubscriptionTier.ENTERPRISE]: {
    name: 'Enterprise',
    pricePerSeat: 45,
    description: 'Full suite of features for large organizations',
  },
} as const;