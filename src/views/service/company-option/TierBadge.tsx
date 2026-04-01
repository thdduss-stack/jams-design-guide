'use client';

type TierLevel = 'premier' | 'vvip' | 'vip' | 'excellent' | 'max' | 'standard';

interface TierBadgeProps {
  tier: TierLevel;
  label: string;
}

const tierStyles: Record<TierLevel, string> = {
  premier: 'bg-blue-900 text-base-white',
  vvip: 'bg-blue-700 text-base-white',
  vip: 'bg-blue-500 text-base-white',
  excellent: 'bg-blue-300 text-base-white',
  max: 'bg-violet-700 text-base-white',
  standard: 'bg-gray-700 text-base-white',
};

export default function TierBadge({ tier, label }: TierBadgeProps) {
  return (
    <span className={`inline-flex items-center px-8 py-4 rounded-4 text-12 font-semibold ${tierStyles[tier]}`}>
      {label}
    </span>
  );
}
