export const mapping = {
    code: `"""
Mapping utilities to suggest a medical professional from a predicted label.
"""

from typing import Dict


LABEL_TO_SPECIALIST: Dict[str, str] = {
    "Psoriasis": "Dermatologist",
    "Varicose Veins": "Vascular Surgeon",
    "peptic ulcer disease": "Gastroenterologist",
    "drug reaction": "Allergist/Immunologist",
    "allergy": "Allergist/Immunologist",
    "urinary tract infection": "Urologist",
    "Hypertension": "Cardiologist",
    "diabetes": "Endocrinologist",
    "Fungal infection": "Dermatologist",
    "Dengue": "Infectious Disease Specialist",
    "Impetigo": "Dermatologist",
    "Typhoid": "Infectious Disease Specialist",
    "Common Cold": "Primary Care Physician",
    "Cervical spondylosis": "Orthopedic Specialist",
    "Chicken pox": "Primary Care Physician",
    "Bronchial Asthma": "Pulmonologist",
    "gastroesophageal reflux disease": "Gastroenterologist",
    "Pneumonia": "Pulmonologist",
    "Migraine": "Neurologist",
    "Arthritis": "Rheumatologist",
    "Acne": "Dermatologist",
    "Malaria": "Infectious Disease Specialist",
    "Dimorphic Hemorrhoids": "Colorectal Surgeon",
    "Jaundice": "Hepatologist",
}
`
}