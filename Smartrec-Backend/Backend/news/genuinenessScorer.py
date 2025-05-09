from .ml_models import load_models
import logging
import numpy as np

logger = logging.getLogger(__name__)


def calculate_genuineness_score(title, description):
    """
    Calculate genuineness score (0-100) using Logistic Regression Model.
    :param title: News article title
    :param description: News article description
    :return: Genuineness score (0-100) or None if models cannot be loaded
    """
    try:
        # Load models from centralized ml_models
        logger.info("Loading models for scoring...")
        LR, vectorizer = load_models()  # Make sure load_models() loads Logistic Regression
        if LR is None or vectorizer is None:
            logger.error("Models could not be loaded for scoring.")
            return None

        # Combine title and description
        text = title + " " + (description if description else "")
        logger.info(f"Scoring Text: {text[:100]}...")

        # Ensure text is not empty
        if not text.strip():
            logger.warning("Empty text provided for scoring.")
            return 0.0

        # Vectorize the text using TF-IDF
        logger.info("Vectorizing text...")
        processed_text = vectorizer.transform([text])
        logger.info(f"Text vectorized. Shape: {processed_text.shape}")

        # Predict the probability of being Real (class 1)
        logger.info("Predicting probability with Logistic Regression...")
        prob_real = LR.predict_proba(processed_text)[0][1]
        logger.info(f"Predicted Probability: {prob_real}")

        # Ensure the probability is between 0 and 1
        prob_real = max(0.0, min(1.0, prob_real))
        logger.info(f"Probability (Clamped): {prob_real}")

        # Convert to a score (0-100)
        score = round(prob_real * 100, 2)
        logger.info(f"Genuineness Score Calculated: {score}")
        return score

    except Exception as e:
        logger.error(f"Error calculating genuineness score: {str(e)}")
        return None
