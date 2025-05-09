import joblib
import os
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

# Define the absolute path to your models directory
MODEL_DIR = os.path.join(settings.BASE_DIR, 'news', 'ml_models')

# Global Variables (Loaded Once)
RF_optimized = None
vectorizer = None


def load_models():
    """
    Load the Random Forest model and TF-IDF Vectorizer only once.
    Returns the models if loaded successfully.
    """
    global RF_optimized, vectorizer
    if RF_optimized is None or vectorizer is None:
        try:
            # Log the model directory
            logger.info(f"Loading models from: {MODEL_DIR}")

            # Load the Random Forest model and TF-IDF Vectorizer using absolute paths
            RF_optimized = joblib.load(os.path.join(MODEL_DIR, 'optimized_logistic_regression_model.joblib'))
            vectorizer = joblib.load(os.path.join(MODEL_DIR, 'tfidf_vectorizer.joblib'))

            # Log successful model loading
            logger.info("ML models loaded successfully from ml_models.")
        except Exception as e:
            logger.error(f"Error loading ML models from ml_models: {str(e)}")
            RF_optimized, vectorizer = None, None

    return RF_optimized, vectorizer
