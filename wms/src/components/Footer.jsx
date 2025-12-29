import React from 'react';
import { ShieldCheck, Copyright } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (

        
        <footer className="w-full bg-white border-t border-slate-100 py-4 px-10 relative z-20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Left Side: Brand & Copyright */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">
                            Manaram Creations
                        </span>
                        <span className="text-slate-300">|</span>
                        <div className="flex items-center gap-1 text-slate-500 text-[11px] font-bold">
                            <Copyright size={12} />
                            <span>{currentYear} All Rights Reserved</span>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                        Industrial Workflow Management System v1.0.4
                    </p>
                </div>


            </div>
        </footer>
    );
};

export default Footer;