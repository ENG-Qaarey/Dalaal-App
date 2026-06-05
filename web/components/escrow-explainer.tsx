"use client";

import { useState } from "react";
import { Lock, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Coins, RefreshCw } from "lucide-react";

interface Step {
  id: number;
  title: string;
  desc: string;
  icon: any;
  color: string;
  badge: string;
}

const escrowSteps: Step[] = [
  {
    id: 1,
    title: "Lock Deposits",
    desc: "Buyer initiates payment using Somali mobile money (EVC Plus, ZAAD, SAHAL). Funds are secured in Dalaal's central escrow vault.",
    icon: Lock,
    color: "bg-amber-500 shadow-amber-500/20 text-amber-600 dark:text-amber-400",
    badge: "PENDING_DEPOSIT"
  },
  {
    id: 2,
    title: "Verify Assets",
    desc: "Certified Dalaal brokers verify the property deeds or vehicle condition checklists. AI face-selfie matching validates the seller.",
    icon: ShieldCheck,
    color: "bg-sky-500 shadow-sky-500/20 text-sky-600 dark:text-sky-400",
    badge: "HOLDING"
  },
  {
    id: 3,
    title: "Release & Payout",
    desc: "Upon successful buyer review and handover confirmation, funds are automatically disbursed to the seller's account minus platform fees.",
    icon: CheckCircle2,
    color: "bg-emerald-500 shadow-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    badge: "RELEASED"
  }
];

export default function EscrowExplainer() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-950/40 rounded-3xl border border-zinc-100 dark:border-zinc-900 px-6 sm:px-12 my-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/40">
            Escrow Trust Protocol
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mt-4">
            Zero-Scam Transaction Safety
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-3 max-w-xl mx-auto">
            Diaspora buyers and local users transact without risk. Here is how our automated escrow contract handles transactions.
          </p>
        </div>

        {/* Step Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 mb-12">
          {escrowSteps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`p-6 text-left rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 shadow-lg scale-[1.02]"
                    : "bg-white/40 dark:bg-zinc-900/20 border-zinc-200/60 dark:border-zinc-800/40 hover:bg-white/70 dark:hover:bg-zinc-900/40"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 ${step.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-md ${
                    idx === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" :
                    idx === 1 ? "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400" :
                    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                  }`}>
                    {step.badge}
                  </span>
                </div>

                <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                  {step.id}. {step.title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-2 leading-relaxed">
                  {step.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Simulated Live Transaction Preview Box */}
        <div className="bg-zinc-900 text-zinc-100 rounded-2xl p-6 border border-zinc-800 shadow-inner relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-mono text-zinc-400">Live Escrow State Ledger</span>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
              Contract ID: esc-983b-4fa
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-mono">
            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-zinc-500">Asset Title:</span>
                <span className="text-zinc-300 font-medium">Diaspora Villa, Hodan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Deposit Amount:</span>
                <span className="text-emerald-400 font-bold">$245,000.00 USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Platform Fee (1.5%):</span>
                <span className="text-zinc-400 font-semibold">$3,675.00 USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Net Seller Payout:</span>
                <span className="text-indigo-400 font-semibold">$241,325.00 USD</span>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Milestone State:</span>
                <span className="text-zinc-300 font-semibold uppercase">{escrowSteps[activeStep].badge}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full transition-all duration-500"
                  style={{ width: `${((activeStep + 1) / 3) * 100}%` }}
                />
              </div>

              <div className="text-xs text-zinc-400 leading-relaxed pt-1.5 flex gap-1.5 items-start">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  {activeStep === 0 && "Waiting for Somali mobile network node confirmation..."}
                  {activeStep === 1 && "Documents are locked in verification state. AI matching in progress."}
                  {activeStep === 2 && "Deposit verified and released. Transaction audit logs generated."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
