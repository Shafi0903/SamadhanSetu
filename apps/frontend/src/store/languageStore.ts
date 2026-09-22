import { create } from "zustand";

export type Language = "en" | "hi";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "app.title": "SamadhanSetu",
    "app.subtitle": "Bridging Citizens, Government, Academia & Industry",
    "nav.challengeBoard": "Challenge Board",
    "nav.howItWorks": "How It Works",
    "nav.stakeholders": "Stakeholders",
    "nav.analytics": "Impact Analytics",
    "nav.signIn": "Sign In",
    "nav.getStarted": "Get Started",
    "hero.badge": "Grassroots Challenges Meet Academic & Industry Innovation",
    "hero.title": "Bridging Civic Challenges with",
    "hero.titleHighlight": "Real-World Solutions",
    "hero.subtitle": "SamadhanSetu connects citizens reporting everyday civic issues with university innovators and industry CSR partners to deliver verified, tangible impact.",
    "hero.reportCta": "Report a Civic Issue",
    "hero.exploreCta": "Explore Challenge Board",
    "role.citizen": "Citizens (Reporters)",
    "role.government": "Government (Verifiers)",
    "role.university": "Universities (Solvers)",
    "role.industry": "Industry (Enablers)",
    "status.reported": "Reported",
    "status.verified": "Verified",
    "status.claimed": "Claimed",
    "status.supported": "Supported",
    "status.resolved": "Resolved",
  },
  hi: {
    "app.title": "समाधानसेतु",
    "app.subtitle": "नागरिक, प्रशासन, विश्वविद्यालय और उद्योग का संगम",
    "nav.challengeBoard": "चैलेंज बोर्ड",
    "nav.howItWorks": "यह कैसे काम करता है",
    "nav.stakeholders": "सहभागी",
    "nav.analytics": "प्रभाव विश्लेषण",
    "nav.signIn": "लॉग इन",
    "nav.getStarted": "शुरू करें",
    "hero.badge": "जमीनी समस्याएं और अकादमिक व उद्योग नवाचार का सेतु",
    "hero.title": "नागरिक समस्याओं का",
    "hero.titleHighlight": "प्रमाणित समाधान",
    "hero.subtitle": "समाधानसेतु आम नागरिकों द्वारा उठाई गई समस्याओं को विश्वविद्यालय के शोधकर्ताओं और उद्योग CSR से जोड़कर ठोस बदलाव लाता है।",
    "hero.reportCta": "समस्या दर्ज करें",
    "hero.exploreCta": "चैलेंज बोर्ड देखें",
    "role.citizen": "नागरिक (समस्या प्रेषक)",
    "role.government": "नगर प्रशासन (सत्यापनकर्ता)",
    "role.university": "विश्वविद्यालय (समाधानकर्ता)",
    "role.industry": "उद्योग एवं CSR (सहयोगी)",
    "status.reported": "दर्ज",
    "status.verified": "सत्यापित",
    "status.claimed": "स्वीकृत",
    "status.supported": "सहयोग प्राप्त",
    "status.resolved": "समाधान संपन्न",
  },
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: "en",
  setLanguage: (language: Language) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("samadhansetu_lang", language);
    }
    set({ language });
  },
  t: (key: string) => {
    const lang = get().language;
    return translations[lang]?.[key] || translations["en"]?.[key] || key;
  },
}));
