import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrustBar from '@/components/TrustBar';
import Home from '@/pages/Home';
import CompanyVerification from '@/pages/CompanyVerification';
import JobHistory from '@/pages/JobHistory';
import Alerts from '@/pages/Alerts';
import Tracker from '@/pages/Tracker';
import Pricing from '@/pages/Pricing';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import RefundPolicy from '@/pages/RefundPolicy';
import ContactUs from '@/pages/ContactUs';
import WhatsAppButton from '@/components/WhatsAppButton';

function App() {
  const [page, setPage] = useState('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  useEffect(() => {
    const removeBoltBadge = () => {
      document.querySelectorAll('*').forEach((el) => {
        if (el.textContent?.includes('Made in Bolt')) {
          const parent = el.closest('div');
          if (parent) parent.style.display = 'none';
        }
      });
    };
    removeBoltBadge();
    setTimeout(removeBoltBadge, 1000);
    setTimeout(removeBoltBadge, 3000);
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case 'home': return <Home onNavigate={setPage} />;
      case 'company': return <CompanyVerification />;
      case 'history': return <JobHistory />;
      case 'alerts': return <Alerts />;
      case 'tracker': return <Tracker />;
      case 'pricing': return <Pricing onNavigate={setPage} />;
      case 'privacy': return <PrivacyPolicy />;
      case 'terms': return <TermsOfService />;
      case 'refund': return <RefundPolicy />;
      case 'contact': return <ContactUs />;
      default: return <Home onNavigate={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#08090A] text-white noise-overlay">
      <TrustBar />
      <Header currentPage={page} onNavigate={setPage} />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer onNavigate={setPage} />
      <WhatsAppButton />
    </div>
  );
}

export default App;
