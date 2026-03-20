import React, { useState } from 'react';
import { ArrowRightLeft, Copy, Check, Loader2, Volume2, X } from 'lucide-react';

const TranslationBox = () => {
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Urdu');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const languages = [
    "English", "Urdu", "Spanish", "French", "German", "Chinese", "Arabic", "Hindi"
  ];

  const handleTranslate = () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    // Simulation of Translation (Backend AI Engine later)
    setTimeout(() => {
      setOutputText(
        targetLang === 'Urdu' 
          ? "یہ ایک ٹیسٹ ترجمہ ہے کیونکہ ابھی اصلی اے آئی انجن منسلک نہیں ہے۔" 
          : "This is a test translation because the real AI engine is not connected yet."
      );
      setIsLoading(false);
    }, 1500);
  };

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText(inputText);
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      
      {/* Header: Language Selectors */}
      <div className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select 
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="bg-transparent font-semibold text-gray-700 dark:text-gray-200 cursor-pointer focus:outline-none hover:text-blue-600 transition"
          >
            {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
          </select>
        </div>

        <button 
          onClick={handleSwap}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-500"
          title="Swap Languages"
        >
          <ArrowRightLeft size={18} />
        </button>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <select 
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-transparent font-semibold text-blue-600 cursor-pointer focus:outline-none"
          >
            {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
          </select>
        </div>
      </div>

      {/* Body: Input & Output */}
      <div className="flex flex-col md:flex-row h-64 md:h-80 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700">
        
        {/* Input Area */}
        <div className="relative w-full md:w-1/2 p-6 group">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type text to translate..."
            className="w-full h-full bg-transparent resize-none border-none outline-none text-lg text-gray-800 dark:text-white placeholder-gray-400"
            spellCheck="false"
          />
          {inputText && (
            <button 
              onClick={() => { setInputText(''); setOutputText(''); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition"
            >
              <X size={20} />
            </button>
          )}
          <div className="absolute bottom-4 left-6 text-xs text-gray-400">
            {inputText.length} chars
          </div>
        </div>

        {/* Output Area */}
        <div className="relative w-full md:w-1/2 p-6 bg-gray-50/50 dark:bg-gray-900/30">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-blue-600">
              <Loader2 className="animate-spin mr-2" /> Translating...
            </div>
          ) : (
            <div className="h-full relative group">
              {outputText ? (
                <>
                  <p className="text-lg text-gray-800 dark:text-white leading-relaxed">
                    {outputText}
                  </p>
                  <div className="absolute bottom-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-500">
                      <Volume2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleCopy(outputText)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-500"
                    >
                      {copied ? <Check size={18} className="text-green-500"/> : <Copy size={18} />}
                    </button>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 italic">
                  Translation will appear here
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer: Action Button */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
        <button 
          onClick={handleTranslate}
          disabled={!inputText || isLoading}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? 'Processing...' : 'Translate Text'}
        </button>
      </div>

    </div>
  );
};

export default TranslationBox;