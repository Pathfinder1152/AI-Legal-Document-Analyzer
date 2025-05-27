"""
Test script for the clause classifier.
This script can be used to test the clause classifier with sample legal clauses.
"""

import sys
import os
import django

# Add the parent directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend', 'backend_core'))

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_core.settings")
django.setup()

# Import the classifier after Django setup
from models.clause_classifier.classifier import get_classifier

def test_classifier():
    """Test the clause classifier with some sample legal clauses"""
    # Sample clauses to test
    test_clauses = [
        # Governing Law example
        "This Agreement shall be governed by and construed in accordance with the laws of the State of California.",
        
        # Confidentiality example
        "Each party agrees to maintain the confidentiality of any proprietary information received from the other party.",
        
        # Termination example
        "Either party may terminate this Agreement upon thirty (30) days written notice to the other party.",
          # Force Majeure example
        "Neither party shall be liable for any failure to perform due to causes beyond its reasonable control including acts of God, fire, flood, or other natural disaster.",
        
        # Payment Terms example
        "Customer shall pay all invoiced amounts within thirty (30) days of the invoice date."
    ]
    
    print("=========================================")
    print("TESTING CLAUSE CLASSIFIER")
    print("=========================================")
    print("Loading clause classifier...")
    classifier = get_classifier()
    classifier.load()
    print("Classifier loaded successfully!")
    
    print("\nTesting with sample clauses:")
    print("-" * 80)
    
    results = classifier.classify_batch(test_clauses)
    
    for i, (clause, result) in enumerate(zip(test_clauses, results)):
        print(f"\nExample {i+1}:")
        print(f"Text: {clause}")
        print(f"Predicted clause type: {result['clause_type']}")
        print(f"Confidence: {result['confidence']:.2%}")
          # Print top 3 predictions if available
        if 'all_probabilities' in result:
            print("Top predictions:")
            top_predictions = sorted(
                [(k, v) for k, v in result['all_probabilities'].items()],
                key=lambda x: x[1],
                reverse=True
            )[:3]
            
            for clause_type, probability in top_predictions:
                print(f"  - {clause_type}: {probability:.2%}")
        elif 'error' in result:
            print(f"Error: {result['error']}")
        
        print("-" * 80)

if __name__ == "__main__":
    test_classifier()
