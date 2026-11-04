import { ShieldCheck, Twitter, Github, Linkedin, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Job Verifier', page: 'home' },
      { label: 'Company Lookup', page: 'company' },
      { label: 'Job History', page: 'history' },
      { label: 'Application Tracker', page: 'tracker' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Pricing', page: 'pricing' },
      { label: 'Alerts Dashboard', page: 'alerts' },
      { label: 'Trust Score Guide', page: 'home' },
      { label: 'API Docs', page: 'pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', page: 'home' },
      { label: 'Blog', page: 'home' },
      { label: 'Careers', page: 'home' },
      { label: 'Contact Us', page: 'contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', page: 'privacy' },
      { label: 'Terms of Service', page: 'terms' },
      { label: 'Refund Policy', page: 'refund' },
      { label: 'Contact Us', page: 'contact' },
    ],
  },
];

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-white/[0.06] bg-[#08090A]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[15px] font-bold tracking-tight text-white">JobCheck</span>
                <span className="text-[10px] font-medium text-blue-400 tracking-wider">.pro</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-4">
              The trust layer for jobs. Don't Apply. Verify. Protecting job seekers from fake listings and scams worldwide.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-[13px] font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => onNavigate(link.page)}
                      className="text-[13px] text-gray-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; 2026 JobCheck Pro &mdash; All rights reserved. Made for Indian Job Seekers <span className="inline-block align-middle">🇮🇳</span> | Don't Apply. Verify.
          </p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('privacy')} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Privacy Policy</button>
            <button onClick={() => onNavigate('terms')} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Terms of Service</button>
            <button onClick={() => onNavigate('refund')} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Refund Policy</button>
            <button onClick={() => onNavigate('contact')} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Contact Us</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
