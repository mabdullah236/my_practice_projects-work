import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      "welcome": "Welcome back",
      "translate_btn": "Translate Text",
      "history": "History"
    }
  },
  ur: {
    translation: {
      "welcome": "خوش آمدید",
      "translate_btn": "ترجمہ کریں",
      "history": "تاریخچہ"
    }
  },
  es: {
    translation: {
      "welcome": "Bienvenido de nuevo",
      "translate_btn": "Traducir texto",
      "history": "Historia"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;