import time
import torch
from transformers import MBartForConditionalGeneration, MBart50TokenizerFast
from functools import lru_cache

class TranslationEngine:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(TranslationEngine, cls).__new__(cls)
            cls._instance.model = None
            cls._instance.tokenizer = None
            cls._instance.device = "cuda" if torch.cuda.is_available() else "cpu"
        return cls._instance

    def load_model(self):
        """Loads the model into memory. This takes time on first run."""
        if not self.model:
            print(f"Loading AI Model on {self.device}... (This may take a minute)")
            model_name = "facebook/mbart-large-50-many-to-many-mmt"
            
            self.tokenizer = MBart50TokenizerFast.from_pretrained(model_name)
            self.model = MBartForConditionalGeneration.from_pretrained(model_name).to(self.device)
            print("Model loaded successfully.")

    @lru_cache(maxsize=1000)
    def cached_translation(self, text: str, src_lang: str, tgt_lang: str):
        """
        Wrapper to enable caching for frequent translations.
        LRU Cache stores the last 1000 unique requests in RAM.
        """
        return self._perform_inference(text, src_lang, tgt_lang)

    def _perform_inference(self, text: str, src_lang: str, tgt_lang: str):
        # Map simple codes to mBART specific codes
        lang_map = {
            "en": "en_XX",
            "ur": "ur_PK", # Urdu
            "pa": "pa_IN", # Punjabi
            "hi": "hi_IN",
            "fr": "fr_XX",
            "es": "es_XX"
        }

        # Validate language support
        if src_lang not in lang_map or tgt_lang not in lang_map:
            raise ValueError(f"Language pair {src_lang}->{tgt_lang} not supported.")

        m_src = lang_map[src_lang]
        m_tgt = lang_map[tgt_lang]

        # 1. Tokenize
        self.tokenizer.src_lang = m_src
        encoded_input = self.tokenizer(text, return_tensors="pt").to(self.device)

        # 2. Generate Translation
        start_time = time.time()
        generated_tokens = self.model.generate(
            **encoded_input,
            forced_bos_token_id=self.tokenizer.lang_code_to_id[m_tgt]
        )
        duration = time.time() - start_time

        # 3. Decode
        translated_text = self.tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]

        return {
            "text": translated_text,
            "performance_ms": round(duration * 1000, 2)
        }

# Global Instance
engine = TranslationEngine()