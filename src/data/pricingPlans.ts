import { Sparkles, Zap, Crown, type LucideIcon } from 'lucide-react';
import type { Currency } from '@/hooks/useGeoPricing';

export type PlanId = 'free' | 'pro' | 'enterprise';

export interface PlanPrice {
  USD: string;
  INR: string;
}

export interface PricingPlan {
  id: PlanId;
  name: string;
  tagline: string;
  icon: LucideIcon;
  monthly: PlanPrice;
  annual: PlanPrice | null;
  unit: 'forever' | '/month';
  features: string[];
  cta: string;
  highlighted: boolean;
  accent: { text: string; soft: string; border: string };
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'For getting started',
    icon: Sparkles,
    monthly: { USD: '$0', INR: '₹0' },
    annual: null,
    unit: 'forever',
    features: [
      '5 job verifications per month',
      'Basic risk report',
      'Basic risk score',
      'Application tracker (10 jobs)',
      'Community support',
    ],
    cta: 'Start Free',
    highlighted: false,
    accent: { text: 'text-gray-300', soft: 'bg-white/[0.06]', border: 'border-white/10' },
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For active job seekers',
    icon: Zap,
    monthly: { USD: '$5', INR: '₹199' },
    annual: { USD: '$3.99', INR: '₹149' },
    unit: '/month',
    features: [
      '500 job verifications per month',
      'Advanced AI risk report',
      'PDF report export',
      'Full job posting history',
      'Real-time job change alerts',
      'Watch up to 25 jobs',
      'Priority support',
    ],
    cta: 'Go Pro',
    highlighted: true,
    accent: { text: 'text-blue-400', soft: 'bg-blue-500/10', border: 'border-blue-500/30' },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For teams and platforms',
    icon: Crown,
    monthly: { USD: '$49', INR: '$49' },
    annual: null,
    unit: '/month',
    features: [
      'Unlimited job verifications',
      'API access',
      'Team seats (10)',
      'Real-time webhook alerts',
      'Custom risk scoring models',
      'Dedicated account manager',
      'SLA and 99.9% uptime',
    ],
    cta: 'Contact Sales',
    highlighted: false,
    accent: { text: 'text-amber-400', soft: 'bg-amber-500/10', border: 'border-amber-500/30' },
  },
];

export function priceFor(plan: PricingPlan, currency: Currency, annual: boolean): string {
  const set = annual && plan.annual ? plan.annual : plan.monthly;
  return set[currency];
}
