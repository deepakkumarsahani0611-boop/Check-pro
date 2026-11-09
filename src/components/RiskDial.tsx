// src/components/RiskDial.tsx - 100% REAL, NO MOCKDATA
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

interface RiskDialProps {
  score: number;
  size?: number;
  animate?: boolean;
}

// REAL logic - No mockData. Trust Score: 70+ = Safe, 40-69 = Caution, <40 = Danger
function getTrustColor(score: number) {
  if (score >= 70) return '#10B981';
  if (score >= 40) return '#F59E0B';
  return '#EF4444';
}
function getTrustLabel(score: number) {
  if (score >= 70) return 'Verified Safe';
  if (score >= 40) return 'Use Caution';
  return 'High Risk';
}

export default function RiskDial({ score, size = 200, animate = true }: RiskDialProps) {
  // Clamp - agar kabhi 105 ya -5 aa jaye to bhi Dial na toote
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  const color = getTrustColor(safeScore);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  // FIXED: Pehle ulta tha, ab sahi hai - Zyada score = Safe
  const StatusIcon = safeScore >= 70 ? ShieldCheck : safeScore >= 40 ? ShieldAlert : ShieldX;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animate ? { strokeDashoffset: circumference } : false}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span initial={animate ? { opacity: 0, scale: 0.5 } : false} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.4 }} className="mb-1">
          <StatusIcon className="w-7 h-7" style={{ color }} />
        </motion.span>
        <span className="text-[40px] font-bold leading-tight" style={{ color }}>{safeScore}</span>
        <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">Trust Score</span>
        <span className="text-[10px] font-medium mt-1" style={{ color }}>{getTrustLabel(safeScore)}</span>
      </div>
    </div>
  );
}
