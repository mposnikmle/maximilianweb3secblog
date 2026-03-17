export const app = {
    code: `import os
import sys
import joblib
import streamlit as st

# Ensure project root is on sys.path so 'src' package resolves when run via Streamlit
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.append(PROJECT_ROOT)

from src.models.mapping import suggest_professional
from src.ui.utils import clean_text, to_english


MODEL_PATH = "artifacts/medical_model.joblib"
VIS_DIR = "artifacts/visualizations"


@st.cache_resource
def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Trained model not found at {MODEL_PATH}. Run training first.")
    return joblib.load(MODEL_PATH)


def main():
    st.set_page_config(page_title="Medical Triage Dashboard", layout="wide")
    st.title("Medical Triage Dashboard")
    
    # User Safety Disclaimer
    st.warning(
        "**DISCLAIMER:** This product is a Support System and prototype, "
        "not a replacement for professional medical judgment. "
        "Always consult with a qualified healthcare professional for medical advice, diagnosis, or treatment."
    )
    
    # Layout: left inputs, right visuals
    col_left, col_right = st.columns([1, 1])

    # Interactive query system: Users input symptoms, system responds with real-time predictions
    with col_left:
        st.subheader("Enter your symptoms")
        user_text = st.text_area(
            "Describe your symptoms (any language):",
            height=160,
            placeholder="e.g., I have chest pain and shortness of breath...",
        )
        predict_btn = st.button("Suggest Specialist")

        # Prediction flow - placed directly below input for better UX
        if predict_btn:
            if not user_text.strip():
                st.warning("Please enter your symptoms.")
            else:
                # Translate to English if needed
                translated_text, lang = to_english(user_text.strip())
                cleaned = clean_text(translated_text)

                try:
                    pipeline = load_model()
                except Exception as e:
                    st.error(f"Error loading model: {e}")
                    return

                # Decision support: System predicts condition and recommends appropriate medical specialist
                # Predict
                try:
                    pred_label = pipeline.predict([cleaned])[0]
                    proba = None
                    if hasattr(pipeline, "predict_proba"):
                        proba = max(pipeline.predict_proba([cleaned])[0])
                except Exception as e:
                    st.error(f"Prediction failed: {e}")
                    return

                specialist = suggest_professional(pred_label)

                st.subheader("Suggested Care")
                st.write(f"Detected Input Language: {lang.upper()}")
                st.write(f"Predicted Condition/Specialty: {pred_label}")
                if proba is not None:
                    st.write(f"Confidence: {proba * 100:.2f}%")
                st.success(f"Suggested Medical Professional: {specialist}")

                with st.expander("Processed Text (English)"):
                    st.code(cleaned)

    # Dashboard displays three visualization types:
    # 1. Confusion Matrix (heatmap) - model prediction accuracy
    # 2. Class Distribution (bar chart) - training vs test data balance
    # 3. Top Keywords (horizontal bar charts) - feature importance by specialty
    with col_right:
        st.subheader("Model Visualizations")
        cm_path = os.path.join(VIS_DIR, "confusion_matrix.png")
        dist_path = os.path.join(VIS_DIR, "class_distribution.png")
        keywords_path = os.path.join(VIS_DIR, "top_keywords.png")

        # Display visuals if available
        if os.path.exists(cm_path):
            st.image(cm_path, caption="Confusion Matrix", width='stretch')
        else:
            st.info("Confusion Matrix not found. Generate via evaluation pipeline.")

        if os.path.exists(dist_path):
            st.image(dist_path, caption="Class Distribution", width='stretch')
        else:
            st.info("Class Distribution not found. Generate via evaluation pipeline.")

        if os.path.exists(keywords_path):
            st.image(keywords_path, caption="Top Predictive Keywords", width='stretch')
        else:
            st.info("Top Predictive Keywords not found. Generate via evaluation pipeline.")

`
}