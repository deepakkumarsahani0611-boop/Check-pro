import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Menu, X, Check } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'Verify Job' },
  { id: 'company', label: 'Companies' },
  { id: 'history', label: 'Job History' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'tracker', label: 'Tracker' },
  { id: 'pricing', label: 'Pricing' },
];

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#08090A]/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#08090A]/60">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => handleNav('home')} className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 rounded-lg bg-blue-500/30 blur-md group-hover:bg-blue-500/50 transition-all" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-bold tracking-tight text-white">JobCheck</span>
              <span className="text-[10px] font-medium text-blue-400 tracking-wider">.pro</span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`relative px-3.5 py-2 text-[13px] font-medium rounded-lg transition-all ${
                  currentPage === item.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-white/[0.06] -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button className="text-[13px] font-medium text-gray-400 hover:text-white transition-colors">
              Sign In
            </button>
            <button
              onClick={() => handleNav('pricing')}
              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 rounded-lg transition-all"
            >
              <span>Get Pro</span>
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-white/[0.06]"
          >
            <div className="px-6 py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    currentPage === item.id
                      ? 'text-white bg-white/[0.06]'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {item.label}
                  {currentPage === item.id && <Check className="w-4 h-4 text-blue-400 ml-auto" />}
                </button>
              ))}
              <div className="pt-2 border-t border-white/[0.06] flex gap-2">
                <button className="flex-1 py-2.5 text-sm font-medium text-gray-400 hover:text-white border border-white/10 rounded-lg">Sign In</button>
                <button onClick={() => handleNav('pricing')} className="flex-1 py-2.5 text-sm font-semibold text-white bg-white/[0.08] border border-white/10 rounded-lg">Get Pro</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
