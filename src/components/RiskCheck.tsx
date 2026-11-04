import { Globe, Mail, DollarSign, Copy, MessageCircle, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import type { RiskCheck as RiskCheckType } from '@/data/mockData';

const iconMap: Record<string, typeof Globe> = {
  Globe,
  Mail,
  DollarSign,
  Copy,
  MessageCircle,
};

export default function RiskCheck({ check }: { check: RiskCheckType }) {
  const Icon = iconMap[check.icon] || Globe;
  const statusConfig = {
    pass: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/15' },
    fail: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/5', border: 'border-red-500/15' },
    warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/5', border: 'border-amber-500/15' },
  };
  const config = statusConfig[check.status];
  const StatusIcon = config.icon;

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${config.border} ${config.bg} transition-all hover:scale-[1.01]`}>
      <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[13px] font-semibold text-white">{check.label}</span>
          <StatusIcon className={`w-4 h-4 ${config.color} flex-shrink-0`} />
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{check.detail}</p>
      </div>
    </div>
  );
}
