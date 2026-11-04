import { motion } from 'framer-motion';
import { getRiskColor, getRiskLabel } from '@/data/mockData';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

interface RiskDialProps {
  score: number;
  size?: number;
  animate?: boolean;
}

export default function RiskDial({ score, size = 200, animate = true }: RiskDialProps) {
  const color = getRiskColor(score);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const StatusIcon = score < 40 ? ShieldCheck : score < 70 ? ShieldAlert : ShieldX;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animate ? { strokeDashoffset: circumference } : false}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <StatusIcon className="w-7 h-7 mb-1" style={{ color }} />
        <motion.span
          initial={animate ? { opacity: 0, scale: 0.5 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-4xl font-bold tracking-tight"
          style={{ color }}
        >
          {score}
        </motion.span>
        <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">
          Risk Score
        </span>
        <span className="text-[10px] font-medium mt-1" style={{ color }}>
          {getRiskLabel(score)}
        </span>
      </div>
    </div>
  );
}
