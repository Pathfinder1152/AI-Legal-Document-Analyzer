"""
Clause classifier module for legal document analysis.
Loads a fine-tuned RoBERTa model to classify legal clauses into different types.

The model was trained on the LEDGAR dataset to classify sentences into different clause types.
"""

import os
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import logging

logger = logging.getLogger(__name__)

# Define the path to the model files - relative to this file
MODEL_PATH = os.path.dirname(os.path.abspath(__file__))

# Define class labels mapping based on the trained model's labels
# These labels match the exact order and index of the training data
CLASS_LABELS = {
    0: "adjustments", 
    1: "agreements", 
    2: "amendments", 
    3: "anti_corruption_laws", 
    4: "applicable_laws", 
    5: "approvals",
    6: "arbitration", 
    7: "assignments", 
    8: "assigns", 
    9: "authority", 
    10: "authorizations",
    11: "base_salary", 
    12: "benefits", 
    13: "binding_effects", 
    14: "books", 
    15: "brokers",
    16: "capitalization", 
    17: "change_in_control", 
    18: "closings", 
    19: "compliance_with_laws", 
    20: "confidentiality",
    21: "consent_to_jurisdiction", 
    22: "consents", 
    23: "construction", 
    24: "cooperation", 
    25: "costs",
    26: "counterparts", 
    27: "death", 
    28: "defined_terms", 
    29: "definitions", 
    30: "disability",
    31: "disclosures", 
    32: "duties", 
    33: "effective_dates", 
    34: "effectiveness", 
    35: "employment",
    36: "enforceability", 
    37: "enforcements", 
    38: "entire_agreements", 
    39: "erisa", 
    40: "existence",
    41: "expenses", 
    42: "fees", 
    43: "financial_statements", 
    44: "forfeitures", 
    45: "further_assurances",
    46: "general", 
    47: "governing_laws", 
    48: "headings", 
    49: "indemnifications", 
    50: "indemnity",
    51: "insurances", 
    52: "integration", 
    53: "intellectual_property", 
    54: "interests", 
    55: "interpretations",
    56: "jurisdictions", 
    57: "liens", 
    58: "litigations", 
    59: "miscellaneous", 
    60: "modifications",
    61: "no_conflicts", 
    62: "no_defaults", 
    63: "no_waivers", 
    64: "non_disparagement", 
    65: "notices",
    66: "organizations", 
    67: "participations", 
    68: "payments", 
    69: "positions", 
    70: "powers",
    71: "publicity", 
    72: "qualifications", 
    73: "records", 
    74: "releases", 
    75: "remedies",
    76: "representations", 
    77: "sales", 
    78: "sanctions", 
    79: "severability", 
    80: "solvency",
    81: "specific_performance", 
    82: "submission_to_jurisdiction", 
    83: "subsidiaries", 
    84: "successors", 
    85: "survival",
    86: "tax_withholdings", 
    87: "taxes", 
    88: "terminations", 
    89: "terms", 
    90: "titles",
    91: "transactions_with_affiliates", 
    92: "use_of_proceeds", 
    93: "vacations", 
    94: "venues", 
    95: "vesting",
    96: "waiver_of_jury_trials", 
    97: "waivers", 
    98: "warranties", 
    99: "withholdings"
}

# For any additional labels the model might output (up to 99 based on config.json)
# We'll handle them gracefully by defining a function to get the label
def get_class_label(idx):
    """Get the class label for a given index, with fallback for unknown indices."""
    return CLASS_LABELS.get(idx, f"unknown_{idx}")

class ClauseClassifier:
    def __init__(self):
        """Initialize the clause classifier with the pre-trained model."""
        self.model = None
        self.tokenizer = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.loaded = False
        logger.info(f"Clause classifier will use device: {self.device}")
    
    def load(self):
        """Load the model and tokenizer if not already loaded."""
        if self.loaded:
            return
            
        try:
            logger.info(f"Loading clause classification model from {MODEL_PATH}")
            self.tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
            self.model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
            self.model.to(self.device)
            self.model.eval()
            self.loaded = True
            logger.info("Clause classification model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load clause classification model: {str(e)}")
            raise
    
    def classify(self, text):
        """
        Classify the given text into a clause type.
        
        Args:
            text (str): The legal text to classify
            
        Returns:
            dict: Classification result with class and confidence score
        """
        if not self.loaded:
            self.load()
            
        try:
            # Tokenize and prepare input
            inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            # Get predictions
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits
                
            # Get probabilities
            probs = torch.nn.functional.softmax(logits, dim=-1)
              # Get top prediction
            max_prob, max_idx = torch.max(probs, dim=-1)
            predicted_class = get_class_label(max_idx.item())
            
            # Create probabilities dictionary for all class labels
            all_probs = {}
            for i, prob in enumerate(probs[0]):
                if i in CLASS_LABELS:
                    all_probs[CLASS_LABELS[i]] = prob.item()
            
            return {
                "clause_type": predicted_class,
                "confidence": max_prob.item(),
                "all_probabilities": all_probs
            }
        except Exception as e:
            logger.error(f"Error during clause classification: {str(e)}")
            return {
                "clause_type": "unknown",
                "confidence": 0.0,
                "error": str(e)
            }
    
    def classify_batch(self, texts):
        """
        Classify a batch of texts.
        
        Args:
            texts (list): List of texts to classify
            
        Returns:
            list: List of classification results
        """
        return [self.classify(text) for text in texts]

# Singleton instance
_classifier = None

def get_classifier():
    """Get or create the clause classifier singleton."""
    global _classifier
    if _classifier is None:
        _classifier = ClauseClassifier()
    return _classifier
