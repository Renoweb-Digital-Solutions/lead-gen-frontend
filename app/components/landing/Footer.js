import Link from "next/link";
import { ArrowRight } from "lucide-react";

const TwitterIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const LinkedinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const GithubIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          
          {/* Brand & Newsletter */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block text-2xl font-display font-bold text-brand-dark mb-6 tracking-tight">
              RENO<span className="text-brand-blue">WEB</span>
            </Link>
            <p className="text-slate-500 text-sm mb-6 max-w-sm leading-relaxed">
              The real-time data enrichment platform for modern revenue teams. Find, score, and engage your best buyers.
            </p>
            
            <form className="relative max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Subscribe to our newsletter" 
                className="w-full bg-slate-50 border border-slate-200 text-brand-dark text-sm rounded-lg pl-4 pr-12 py-3 outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-brand-blue hover:text-brand-indigo transition-colors rounded-md hover:bg-brand-blue/5"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-brand-dark mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/features" className="hover:text-brand-blue transition-colors">Features</Link></li>
              <li><Link href="/solutions" className="hover:text-brand-blue transition-colors">Solutions</Link></li>
              <li><Link href="/pricing" className="hover:text-brand-blue transition-colors">Pricing</Link></li>
              <li><Link href="/changelog" className="hover:text-brand-blue transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-brand-dark mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-brand-blue transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-brand-blue transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-brand-blue transition-colors">Community</Link></li>
              <li><Link href="#" className="hover:text-brand-blue transition-colors">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-brand-dark mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-brand-blue transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-brand-blue transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-brand-blue transition-colors">Legal</Link></li>
              <li><Link href="/contact" className="hover:text-brand-blue transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Renoweb Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="#" className="hover:text-brand-blue transition-colors"><TwitterIcon className="w-5 h-5" /></Link>
            <Link href="#" className="hover:text-brand-blue transition-colors"><LinkedinIcon className="w-5 h-5" /></Link>
            <Link href="#" className="hover:text-brand-blue transition-colors"><GithubIcon className="w-5 h-5" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
