import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-ledger flex flex-col font-sans selection:bg-brass/30">
      {/* Navigation */}
      <nav className="h-20 flex items-center justify-between px-8 md:px-12 border-b border-fade/20">
        <div className="font-display font-medium text-xl tracking-tight flex items-center gap-2">
          <div className="h-6 w-6 rounded-full border border-brass flex items-center justify-center">
            <div className="h-2 w-2 bg-brass rounded-full" />
          </div>
          Wall of Love
        </div>
        <Link href="/login">
          <Button className="bg-ledger text-paper hover:bg-brass hover:text-ledger transition-colors rounded-none h-10 px-6 font-medium">
            Sign In
          </Button>
        </Link>
      </nav>

      <main className="flex-1 flex flex-col">
        {/* HERO SECTION */}
        <section className="relative w-full border-b border-fade/20 overflow-hidden">
          {/* Decorative Corner Brackets for Hero */}
          <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-fade/30" />
          <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-fade/30" />
          <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-fade/30" />
          <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-fade/30" />
          
          {/* Counter */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 font-mono text-[12px] text-fade/60 tracking-widest uppercase">
            00 / INTRO
          </div>

          <div className="max-w-7xl mx-auto px-8 md:px-16 pt-32 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="flex flex-col items-start gap-8">
              <h1 className="text-5xl md:text-7xl font-display font-medium text-ledger leading-[1.1] tracking-tight">
                Turn scattered praise into verified proof.
              </h1>
              <p className="text-xl text-fade max-w-md leading-relaxed font-sans">
                A single source of truth for your reputation. Collect, verify, and export testimonials for your pitch deck with a literal seal of approval.
              </p>
              <Link href="/login">
                <Button className="h-14 px-8 text-lg bg-brass text-ledger hover:bg-ledger hover:text-paper transition-colors duration-300 rounded-none gap-3 group">
                  Start collecting proof
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Visual Transformation */}
            <div className="relative h-[500px] w-full flex items-center justify-center">
              {/* Background messy quotes */}
              <div className="absolute -left-12 top-10 rotate-[-8deg] bg-white p-6 shadow-md border border-fade/10 max-w-[250px] opacity-60 blur-[1px]">
                <p className="font-sans text-[14px] text-fade">"Amazing work on the strategy deck..."</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-fade/20" />
                  <div className="h-2 w-16 bg-fade/20 rounded-full" />
                </div>
              </div>
              
              <div className="absolute -right-8 bottom-20 rotate-[12deg] bg-white p-6 shadow-md border border-fade/10 max-w-[250px] opacity-60 blur-[1px]">
                <p className="font-sans text-[14px] text-fade">"Highly recommend for any B2B SaaS..."</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-fade/20" />
                  <div className="h-2 w-20 bg-fade/20 rounded-full" />
                </div>
              </div>

              {/* Foreground Stamped Slide */}
              <div className="relative z-10 bg-paper p-8 border-2 border-ledger shadow-xl w-full max-w-md hover:-translate-y-2 transition-transform duration-500">
                <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-ledger bg-paper" />
                <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-ledger bg-paper" />
                
                {/* Seal Mark */}
                <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full border-4 border-brass bg-paper flex items-center justify-center rotate-[15deg] shadow-lg">
                  <CheckCircle2 className="h-8 w-8 text-brass" />
                </div>

                <div className="font-mono text-[10px] text-fade uppercase tracking-widest mb-6 pb-4 border-b border-fade/20 flex justify-between">
                  <span>ID: TX-8892</span>
                  <span>Verified</span>
                </div>
                
                <h3 className="font-display text-2xl text-ledger mb-4 leading-snug">
                  "The most rigorous operational audit we've seen. Paid for itself in week one."
                </h3>
                
                <div className="flex items-center gap-3 mt-8">
                  <div className="h-12 w-12 rounded-full bg-ledger flex items-center justify-center">
                    <span className="font-mono text-paper">MJ</span>
                  </div>
                  <div>
                    <p className="font-medium text-ledger">Michael Jenkins</p>
                    <p className="text-[14px] text-fade font-mono uppercase tracking-wider">VP Ops, Enterprise Co</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE SECTION 1 */}
        <section className="relative w-full border-b border-fade/20">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-fade/30 m-8" />
          <div className="max-w-7xl mx-auto px-8 md:px-16 py-32 grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="md:col-span-4 flex flex-col">
              <span className="font-mono text-[14px] text-brass uppercase tracking-widest mb-4">01 / The Problem</span>
              <h2 className="text-4xl font-display font-medium text-ledger leading-tight">
                Consultants live and die by reputation.
              </h2>
            </div>
            <div className="md:col-span-8 flex flex-col justify-center">
              <p className="text-2xl text-fade font-sans leading-relaxed">
                But scattered LinkedIn comments don't close $50k deals. You need a centralized ledger of your wins, ready to be deployed into proposals and pitch decks at a moment's notice.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURE SECTION 2 */}
        <section className="relative w-full border-b border-fade/20 bg-ledger text-paper">
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-fade/30 m-8" />
          <div className="max-w-7xl mx-auto px-8 md:px-16 py-32 grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="md:col-span-8 flex flex-col justify-center order-2 md:order-1">
               <p className="text-2xl text-paper/80 font-sans leading-relaxed">
                Send a single link. Approve the best quotes. Your Wall of Love automatically formats them into a high-trust, rigorous layout that screams competence.
              </p>
            </div>
            <div className="md:col-span-4 flex flex-col order-1 md:order-2">
              <span className="font-mono text-[14px] text-brass uppercase tracking-widest mb-4">02 / The Ledger</span>
              <h2 className="text-4xl font-display font-medium text-paper leading-tight">
                Centralized, rigorous proof.
              </h2>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="relative w-full flex flex-col items-center justify-center py-40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-brass/30" />
          <span className="font-mono text-[14px] text-fade uppercase tracking-widest mb-8">03 / Begin</span>
          <h2 className="text-5xl font-display font-medium text-ledger text-center mb-10 max-w-2xl">
            Build the reputation ledger your consultancy deserves.
          </h2>
          <Link href="/login">
            <Button className="h-16 px-10 text-xl bg-brass text-ledger hover:bg-ledger hover:text-paper transition-colors duration-300 rounded-none gap-4">
              Get Started
            </Button>
          </Link>
        </section>
      </main>
      
      <footer className="border-t border-fade/20 py-8 px-8 md:px-12 flex items-center justify-between font-mono text-[12px] text-fade uppercase tracking-widest">
        <span>&copy; {new Date().getFullYear()} Wall of Love</span>
        <span>A Seal of Approval</span>
      </footer>
    </div>
  );
}
