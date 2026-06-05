"use client";

import { useState } from "react";
import { ChevronDown, Globe, HelpCircle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface FAQItem {
  id: number;
  question: {
    en: string;
    so: string;
  };
  answer: {
    en: string;
    so: string;
  };
}

const mockFAQs: FAQItem[] = [
  {
    id: 1,
    question: {
      en: "How does the Escrow Trust Protocol protect me?",
      so: "Sidee ayuu hab-maamuuska Escrow ii ilaalinayaa?"
    },
    answer: {
      en: "When you pay for a property deposit or vehicle reservation, your money is held in our central secure vault (holding state). It is only released to the broker/owner once you verify the land deeds or inspect the car. If fraud is detected, you can open a dispute to get a full refund.",
      so: "Markaad bixiso lacag dhigaal ah oo ku saabsan guri ama gaari, lacagtaada waxaa lagu hayaa khasnaddeena ammaanka ah (holding state). Waxaa loo siidaayaa dulaalka/milkiilaha marka aad xaqiijiso warqadaha dhulka ama aad baarto gaariga. Haddii wax isdaba-marin ah la arko, waxaad furi kartaa dood si aad u hesho lacag-celin buuxda."
    }
  },
  {
    id: 2,
    question: {
      en: "Can I pay using EVC Plus, ZAAD, or SAHAL?",
      so: "Ma ku bixin karaa lacagta EVC Plus, ZAAD, ama SAHAL?"
    },
    answer: {
      en: "Yes! Dalaal has dedicated native merchant API integrations with Hormuud EVC Plus, Telesom ZAAD, and Golis SAHAL. You can initiate and approve deposits directly inside the mobile app or web portal.",
      so: "Haa! Dalaal wuxuu leeyahay isku-xirka rasmiga ah ee shirkadaha Hormuud EVC Plus, Telesom ZAAD, iyo Golis SAHAL. Waxaad si toos ah uga furi kartaa lacag-dhigista gudaha abka mobile-ka ama shabakadda."
    }
  },
  {
    id: 3,
    question: {
      en: "What is a 'Verified Dalaal' and how do I trust them?",
      so: "Waa maxay 'Verified Dalaal' sideenase u aamini karaa?"
    },
    answer: {
      en: "A 'Verified Dalaal' is a broker who has completed our automated AI KYC validation. They submit their National ID/Passport and Business License, which are parsed and verified by our computer vision systems. They carry a verification badge on their profile.",
      so: "Dalaalka la xaqiijiyay ('Verified Dalaal') waa dulaal dhameystiray baaritaanka aqoonsiga AI ee abka. Waxay soo gudbiyeen Kaarka Aqoonsiga Qaranka/Baasaboorka iyo Shatiga Ganacsiga, kuwaas oo lagu hubiyay nidaamkayaga AI. Waxay ku sitaan calaamadda cagaaran ee xaqiijinta boggooda."
    }
  },
  {
    id: 4,
    question: {
      en: "How do I book a tour or schedule a video walkthrough?",
      so: "Sideen u ballansan karaa kormeer guri ama gaari?"
    },
    answer: {
      en: "Under any listing, you can select the 'Book Tour' option. You can schedule either an in-person walkthrough or an online video call. The broker will receive a push notification and confirm the calendar schedule.",
      so: "Hoos kasta oo ka mid ah xayeysiisyada, waxaad dooran kartaa 'Book Tour'. Waxaad ballansan kartaa kormeer qof ahaan ah ama wicitaan muuqaal ah oo toos ah. Dulaalku wuxuu heli doonaa farriin ogeysiis ah wuxuuna xaqiijin doonaa taariikhda ballanta."
    }
  }
];

export default function FAQAccordion() {
  const { lang, setLang } = useLanguage();
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 border-t border-zinc-100 dark:border-zinc-900">
      <div className="max-w-3xl mx-auto">
        {/* Header section with Language Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {lang === "en" ? "Frequently Asked Questions" : "Su'aalaha Badanaa La Weydiiyo"}
            </h2>
          </div>

          {/* Lang Selector */}
          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
            <Globe className="w-3.5 h-3.5 text-zinc-400 ml-2" />
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                lang === "en"
                  ? "bg-white text-zinc-950 dark:bg-zinc-800 dark:text-white shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang("so")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                lang === "so"
                  ? "bg-white text-zinc-950 dark:bg-zinc-800 dark:text-white shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              Soomaali
            </button>
          </div>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {mockFAQs.map((faq) => {
            const isOpen = openId === faq.id;
            const questionText = lang === "en" ? faq.question.en : faq.question.so;
            const answerText = lang === "en" ? faq.answer.en : faq.answer.so;

            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left font-bold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                >
                  <span className="text-sm sm:text-base">{questionText}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 border-t border-zinc-100 dark:border-zinc-800 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed animate-fade-in">
                    {answerText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
