"use client";

import { useState } from "react";
import { Coins, Calculator, Info, Landmark } from "lucide-react";

export default function MortgageCalculator() {
  const [activeTab, setActiveTab] = useState<"buy" | "rent">("buy");

  // Buy Installment States
  const [propertyPrice, setPropertyPrice] = useState(150000);
  const [downPaymentPct, setDownPaymentPct] = useState(30);
  const [years, setYears] = useState(5);
  const [markupRate, setMarkupRate] = useState(5); // 5% yearly markup (typical for local developer installment schemes)

  // Rental states
  const [monthlyRent, setMonthlyRent] = useState(800);
  const [depositMonths, setDepositMonths] = useState(3);
  const [utilityFee, setUtilityFee] = useState(100);

  // Calculations
  const downPaymentAmount = (propertyPrice * downPaymentPct) / 100;
  const principalAmount = propertyPrice - downPaymentAmount;
  const totalMarkup = principalAmount * (markupRate / 100) * years;
  const totalRepayable = principalAmount + totalMarkup;
  const monthlyRepayment = years > 0 ? Math.round(totalRepayable / (years * 12)) : 0;

  // Rent Calculation
  const totalDepositAmount = monthlyRent * depositMonths;
  const initialMoveInTotal = totalDepositAmount + monthlyRent + utilityFee;

  return (
    <section className="py-20 border-t border-zinc-100 dark:border-zinc-900">
      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        {/* Decorative Grid Backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-2xl border border-sky-100 dark:border-sky-900/40">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                Affordability Calculator
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Plan your installments or lease deposits according to Somali standards.
              </p>
            </div>
          </div>

          {/* Tab switches */}
          <div className="flex bg-zinc-100 dark:bg-zinc-850 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setActiveTab("buy")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "buy"
                  ? "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Developer Installments
            </button>
            <button
              onClick={() => setActiveTab("rent")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "rent"
                  ? "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Rent Deposits
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Form Side */}
          <div className="md:col-span-7 space-y-6">
            {activeTab === "buy" ? (
              <>
                {/* Property Price Slider */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-zinc-600 dark:text-zinc-350">Property Cost (USD)</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">${propertyPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="20000"
                    max="500000"
                    step="5000"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(Number(e.target.value))}
                    className="w-full accent-sky-600 dark:accent-sky-400 cursor-pointer h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
                    <span>$20k</span>
                    <span>$250k</span>
                    <span>$500k</span>
                  </div>
                </div>

                {/* Down Payment % Slider */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-zinc-600 dark:text-zinc-350">Down Payment ({downPaymentPct}%)</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">${downPaymentAmount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="70"
                    step="5"
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                    className="w-full accent-sky-600 dark:accent-sky-400 cursor-pointer h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
                    <span>10%</span>
                    <span>40%</span>
                    <span>70%</span>
                  </div>
                </div>

                {/* Period Slider */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-zinc-600 dark:text-zinc-350">Repayment Period</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">{years} Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full accent-sky-600 dark:accent-sky-400 cursor-pointer h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
                    <span>1 Year</span>
                    <span>5 Years</span>
                    <span>10 Years</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Rent Price Slider */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-zinc-600 dark:text-zinc-350">Monthly Lease Cost</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">${monthlyRent}/mo</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="5000"
                    step="50"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full accent-sky-600 dark:accent-sky-400 cursor-pointer h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
                    <span>$150/mo</span>
                    <span>$2,500/mo</span>
                    <span>$5,000/mo</span>
                  </div>
                </div>

                {/* Deposit Months required */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-zinc-600 dark:text-zinc-350">Required Deposit (Months)</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">{depositMonths} months</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={depositMonths}
                    onChange={(e) => setDepositMonths(Number(e.target.value))}
                    className="w-full accent-sky-600 dark:accent-sky-400 cursor-pointer h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
                    <span>1 month</span>
                    <span>3 months</span>
                    <span>6 months</span>
                  </div>
                </div>

                {/* Utility Prepay slider */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-zinc-600 dark:text-zinc-350">Utility Deposit (Water & Power)</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">${utilityFee}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="300"
                    step="10"
                    value={utilityFee}
                    onChange={(e) => setUtilityFee(Number(e.target.value))}
                    className="w-full accent-sky-600 dark:accent-sky-400 cursor-pointer h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full"
                  />
                </div>
              </>
            )}
          </div>

          {/* Results Side */}
          <div className="md:col-span-5 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/50 dark:border-zinc-850 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            {activeTab === "buy" ? (
              <>
                <div className="space-y-4">
                  <span className="text-[10px] font-extrabold tracking-widest text-zinc-400 uppercase">
                    ESTIMATED REPAYMENT
                  </span>
                  <div>
                    <span className="text-4xl sm:text-5xl font-black text-sky-600 dark:text-sky-400">${monthlyRepayment.toLocaleString()}</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">/mo</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                    Calculated with a typical local developer markup of 5% per annum for {years} years.
                  </p>
                </div>

                <div className="space-y-2 pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Down Payment Amount:</span>
                    <span className="text-zinc-850 dark:text-zinc-200">${downPaymentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Remaining Principal:</span>
                    <span className="text-zinc-850 dark:text-zinc-200">${principalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Total Contract Cost:</span>
                    <span className="text-zinc-850 dark:text-zinc-200">${(propertyPrice + totalMarkup).toLocaleString()}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <span className="text-[10px] font-extrabold tracking-widest text-zinc-400 uppercase">
                    INITIAL PAYOUT (MOVE-IN)
                  </span>
                  <div>
                    <span className="text-4xl sm:text-5xl font-black text-sky-600 dark:text-sky-400">${initialMoveInTotal.toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                    Includes {depositMonths} months deposit, first month lease payment, and utility guarantees.
                  </p>
                </div>

                <div className="space-y-2 pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Refunadable Deposit:</span>
                    <span className="text-zinc-850 dark:text-zinc-200">${totalDepositAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">First Month Rent:</span>
                    <span className="text-zinc-850 dark:text-zinc-200">${monthlyRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Utility Safety Fee:</span>
                    <span className="text-zinc-850 dark:text-zinc-200">${utilityFee.toLocaleString()}</span>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-start gap-2 pt-6 text-[10px] text-zinc-400 leading-normal border-t border-zinc-200/60 dark:border-zinc-800/60 mt-4">
              <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>Calculations are estimations. Confirm exact payment structures with developers or agents before signing documents.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
