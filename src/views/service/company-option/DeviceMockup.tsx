'use client';

interface DeviceMockupProps {
  type: 'pc' | 'mobile';
  highlightArea?: 'top' | 'middle' | 'bottom';
  label?: string;
}

export default function DeviceMockup({ type, highlightArea = 'top', label }: DeviceMockupProps) {
  if (type === 'pc') {
    return (
      <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        {/* Monitor */}
        <rect x="20" y="10" width="240" height="150" rx="8" fill="#F8F9FA" stroke="#DEE2E6" strokeWidth="1.5" />
        {/* Screen */}
        <rect x="28" y="18" width="224" height="130" rx="4" fill="white" />
        {/* Browser bar */}
        <rect x="28" y="18" width="224" height="20" rx="4" fill="#F1F3F5" />
        <circle cx="40" cy="28" r="3" fill="#FF6B6B" />
        <circle cx="50" cy="28" r="3" fill="#FFD43B" />
        <circle cx="60" cy="28" r="3" fill="#51CF66" />
        <rect x="80" y="24" width="120" height="8" rx="4" fill="#E9ECEF" />

        {/* Content lines */}
        <rect x="36" y="46" width="80" height="6" rx="2" fill="#E9ECEF" />
        <rect x="36" y="58" width="208" height="4" rx="2" fill="#F1F3F5" />
        <rect x="36" y="66" width="180" height="4" rx="2" fill="#F1F3F5" />

        {/* Highlight area */}
        {highlightArea === 'top' && (
          <g>
            <rect x="36" y="44" width="208" height="30" rx="4" fill="#3B82F6" opacity="0.12" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 2" />
            <text x="140" y="63" textAnchor="middle" fill="#3B82F6" fontSize="9" fontWeight="600">AD</text>
          </g>
        )}
        {highlightArea === 'middle' && (
          <g>
            <rect x="36" y="78" width="208" height="30" rx="4" fill="#3B82F6" opacity="0.12" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 2" />
            <text x="140" y="97" textAnchor="middle" fill="#3B82F6" fontSize="9" fontWeight="600">AD</text>
          </g>
        )}
        {highlightArea === 'bottom' && (
          <g>
            <rect x="36" y="110" width="208" height="30" rx="4" fill="#3B82F6" opacity="0.12" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 2" />
            <text x="140" y="129" textAnchor="middle" fill="#3B82F6" fontSize="9" fontWeight="600">AD</text>
          </g>
        )}

        {/* Content blocks */}
        <rect x="36" y="80" width="100" height="56" rx="4" fill="#F8F9FA" />
        <rect x="144" y="80" width="100" height="56" rx="4" fill="#F8F9FA" />

        {/* Stand */}
        <path d="M120 160 L160 160 L155 175 L125 175 Z" fill="#DEE2E6" />
        <rect x="110" y="175" width="60" height="4" rx="2" fill="#CED4DA" />

        {/* Label */}
        {label && (
          <text x="140" y="195" textAnchor="middle" fill="#868E96" fontSize="10" fontWeight="500">{label}</text>
        )}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* Phone */}
      <rect x="15" y="10" width="90" height="180" rx="16" fill="#F8F9FA" stroke="#DEE2E6" strokeWidth="1.5" />
      {/* Screen */}
      <rect x="21" y="24" width="78" height="152" rx="4" fill="white" />
      {/* Notch */}
      <rect x="42" y="14" width="36" height="6" rx="3" fill="#DEE2E6" />

      {/* Status bar */}
      <rect x="25" y="28" width="30" height="4" rx="2" fill="#E9ECEF" />
      <rect x="65" y="28" width="30" height="4" rx="2" fill="#E9ECEF" />

      {/* Content */}
      <rect x="25" y="40" width="70" height="6" rx="2" fill="#E9ECEF" />
      <rect x="25" y="52" width="50" height="4" rx="2" fill="#F1F3F5" />

      {/* Highlight area */}
      {highlightArea === 'top' && (
        <g>
          <rect x="25" y="38" width="70" height="26" rx="4" fill="#3B82F6" opacity="0.12" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x="60" y="55" textAnchor="middle" fill="#3B82F6" fontSize="8" fontWeight="600">AD</text>
        </g>
      )}
      {highlightArea === 'middle' && (
        <g>
          <rect x="25" y="82" width="70" height="26" rx="4" fill="#3B82F6" opacity="0.12" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x="60" y="99" textAnchor="middle" fill="#3B82F6" fontSize="8" fontWeight="600">AD</text>
        </g>
      )}

      {/* Cards */}
      <rect x="25" y="64" width="70" height="40" rx="4" fill="#F8F9FA" />
      <rect x="29" y="68" width="40" height="4" rx="2" fill="#E9ECEF" />
      <rect x="29" y="76" width="58" height="3" rx="1.5" fill="#F1F3F5" />
      <rect x="29" y="82" width="50" height="3" rx="1.5" fill="#F1F3F5" />
      <rect x="29" y="88" width="54" height="3" rx="1.5" fill="#F1F3F5" />
      <rect x="29" y="94" width="40" height="3" rx="1.5" fill="#F1F3F5" />

      <rect x="25" y="110" width="70" height="40" rx="4" fill="#F8F9FA" />
      <rect x="29" y="114" width="36" height="4" rx="2" fill="#E9ECEF" />
      <rect x="29" y="122" width="58" height="3" rx="1.5" fill="#F1F3F5" />
      <rect x="29" y="128" width="50" height="3" rx="1.5" fill="#F1F3F5" />

      {/* Bottom nav */}
      <rect x="21" y="158" width="78" height="18" rx="0" fill="#F8F9FA" />
      <circle cx="38" cy="167" r="4" fill="#E9ECEF" />
      <circle cx="60" cy="167" r="4" fill="#E9ECEF" />
      <circle cx="82" cy="167" r="4" fill="#E9ECEF" />

      {/* Home indicator */}
      <rect x="45" y="182" width="30" height="4" rx="2" fill="#DEE2E6" />

      {/* Label */}
      {label && (
        <text x="60" y="210" textAnchor="middle" fill="#868E96" fontSize="10" fontWeight="500">{label}</text>
      )}
    </svg>
  );
}
