import React, { useState } from 'react';
import {
  Check,
  CreditCard,
  Crown,
  Flame,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useSuperPost } from '../context/SuperPostContext';

export const BillingView: React.FC = () => {
  const { activeWorkspace, triggerCelebration } = useSuperPost();
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'annual'>('annual');
  const [activePlan, setActivePlan] = useState<string>(activeWorkspace.plan);

  const handleSelectPlan = (planName: string) => {
    setActivePlan(planName);
    triggerCelebration();
  };

  const plans = [
    {
      name: 'Free Starter',
      tagline: 'Ideal for testing and personal accounts',
      priceMonthly: 0,
      priceAnnual: 0,
      channels: 3,
      postsMonthly: 30,
      features: [
        '3 Connected social channels',
        '30 Scheduled posts per month',
        'Standard calendar & queue',
        'Community Discord support',
        '7-day analytics retention',
      ],
      cta: 'Current Base Plan',
      popular: false,
    },
    {
      name: 'Pro Creator',
      tagline: 'For fast-growing creators & agencies',
      priceMonthly: 29,
      priceAnnual: 19,
      channels: 25,
      postsMonthly: 500,
      features: [
        '25 Connected social accounts',
        '500 Scheduled posts per month',
        'Live multi-feed previews (all 28+ channels)',
        'Full AI Copilot & Viral Hook generator',
        'First-comment automation on LinkedIn & IG',
        '90-day deep performance analytics',
        'Best Time to Post algorithmic heatmaps',
      ],
      cta: 'Upgrade to Pro',
      popular: true,
    },
    {
      name: 'Lifetime Founder',
      tagline: 'Pay once, own SuperPost for life',
      priceMonthly: 199,
      priceAnnual: 199,
      oneTime: true,
      channels: 50,
      postsMonthly: 2000,
      features: [
        'Lifetime access (zero recurring fees)',
        '50 Connected channels across all networks',
        '2,000 Posts/month forever',
        'Unlimited AI Copilot generation',
        'All future 2.x & 3.x platform updates included',
        'Priority feature requests & developer support',
      ],
      cta: 'Claim Lifetime Access ($199)',
      popular: false,
      badge: 'Limited Lifetime Deal',
    },
    {
      name: 'Agency & Enterprise',
      tagline: 'For marketing teams managing multiple clients',
      priceMonthly: 89,
      priceAnnual: 69,
      channels: 100,
      postsMonthly: 'Unlimited',
      features: [
        'Unlimited social channels & team seats',
        'Dedicated workspace isolation per client',
        'Custom domain CNAME & white-label portal',
        'Full Webhook & REST API access',
        'Priority 24/7 SLA & dedicated account manager',
      ],
      cta: 'Contact Enterprise',
      popular: false,
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto bg-[#0b0f17] p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5" />
          <span>SuperPost Transparent Pricing</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Supercharge your cross-channel social distribution
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Open-source power with zero vendor lock-in. Switch plans or claim our limited-time founder deal.
        </p>

        {/* Billing cycle toggle */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSelectedCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedCycle === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setSelectedCycle('annual')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                selectedCycle === 'annual' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              <span>Annual (Save 35%)</span>
              <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded-full font-bold">
                2 Mo Free
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {plans.map((plan) => {
          const isSelected = activePlan === plan.name || (activePlan === 'Pro' && plan.name === 'Pro Creator');
          const price = plan.oneTime
            ? plan.priceAnnual
            : selectedCycle === 'annual'
            ? plan.priceAnnual
            : plan.priceMonthly;

          return (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-5 flex flex-col justify-between border transition-all shadow-xl ${
                plan.popular
                  ? 'bg-gradient-to-b from-indigo-950/60 via-slate-900/90 to-slate-950 border-indigo-500/60 ring-2 ring-indigo-500/20'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{plan.tagline}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white font-mono">
                    ${price}
                  </span>
                  <span className="text-xs text-slate-400">
                    {plan.oneTime ? ' one-time' : '/month'}
                  </span>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-slate-800">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleSelectPlan(plan.name)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                    plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30 hover:scale-[1.02]'
                      : isSelected
                      ? 'bg-slate-800 text-indigo-300 border border-indigo-500/40'
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-200'
                  }`}
                >
                  {isSelected ? 'Current Active Tier' : plan.cta}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security & Refund Guarantee */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-400 max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Encrypted with Stripe & 14-day hassle-free money-back guarantee.</span>
        </div>
        <div className="font-mono text-slate-500">SuperPost Cloud / Self-Host Hybrid</div>
      </div>
    </div>
  );
};
