export const utils = {
    code: `import re
from typing import Tuple
from langdetect import detect, LangDetectException
from deep_translator import GoogleTranslator


def clean_text(text: str) -> str:
    """
    Mirror the training-time cleaning (lower, trim, strip special chars, collapse spaces).
    """
    text = (text or "").lower().strip()
    text = re.sub(r"[^a-z0-9\\s.,!?'-]", "", text)
    text = re.sub(r"\\s+", " ", text)
    return text


def to_english(text: str) -> Tuple[str, str]:
    """
    Detect language and translate to English if needed.
    Returns (processed_text, detected_language_code).
    """
    if not text:
        return "", "en"
    try:
        lang = detect(text)
    except LangDetectException:
        lang = "en"
    if lang != "en":
        try:
            translator = GoogleTranslator(source=lang, target="en")
            translated = translator.translate(text)
            return translated, lang
        except Exception:
            # Fallback: return original text if translation fails
            return text, lang
    return text, lang


`
}