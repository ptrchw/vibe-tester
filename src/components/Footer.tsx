import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f3f3f4] border-t border-[#F0F3FA] py-12 px-4 sm:px-6 mt-16">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-6 gap-8">
        <div className="col-span-2 md:col-span-2">
          <div className="text-xl font-bold text-[#1a1c1c] mb-3">TradingView</div>
          <p className="text-xs text-[#6A6D78]">
            © {new Date().getFullYear()} TradingView, Inc. All rights reserved.
          </p>
          <p className="text-[11px] text-[#6A6D78] mt-2 leading-relaxed">
            Data is provided for informational purposes only and not intended for trading purposes or advice.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold text-[#1a1c1c] uppercase tracking-wider mb-1">Company</span>
          <a href="#" className="text-xs text-[#6A6D78] hover:text-[#1a1c1c] transition-colors">
            About
          </a>
          <a href="#" className="text-xs text-[#6A6D78] hover:text-[#1a1c1c] transition-colors">
            Features
          </a>
          <a href="#" className="text-xs text-[#6A6D78] hover:text-[#1a1c1c] transition-colors">
            Careers
          </a>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold text-[#1a1c1c] uppercase tracking-wider mb-1">Community</span>
          <a href="#" className="text-xs text-[#6A6D78] hover:text-[#1a1c1c] transition-colors">
            Pricing
          </a>
          <a href="#" className="text-xs text-[#6A6D78] hover:text-[#1a1c1c] transition-colors">
            Social Media
          </a>
          <a href="#" className="text-xs text-[#6A6D78] hover:text-[#1a1c1c] transition-colors">
            House rules
          </a>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold text-[#1a1c1c] uppercase tracking-wider mb-1">Legal</span>
          <a href="#" className="text-xs text-[#6A6D78] hover:text-[#1a1c1c] transition-colors">
            Terms of use
          </a>
          <a href="#" className="text-xs text-[#6A6D78] hover:text-[#1a1c1c] transition-colors">
            Privacy policy
          </a>
          <a href="#" className="text-xs text-[#6A6D78] hover:text-[#1a1c1c] transition-colors">
            Disclaimer
          </a>
        </div>
      </div>
    </footer>
  );
};
