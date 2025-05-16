# Clause Classification in AI Legal Document Analyzer

This document describes the clause classification feature implemented in the AI Legal Document Analyzer, which uses a fine-tuned RoBERTa model to classify legal clauses into different types based on the LEDGAR dataset.

## Overview

The clause classification system automatically analyzes legal text annotations to identify specific clause types commonly found in legal documents. This helps users quickly understand the purpose and nature of different clauses without needing to read and interpret the full text.

## Model Details

- **Base Model**: RoBERTa
- **Training Dataset**: LEDGAR (Legal Document Gathering and Retrieval) dataset
- **Classes**: 20 different clause types
- **Input**: Text segments from legal documents
- **Output**: Clause type classification with confidence score

## Supported Clause Types

The model can identify the following clause types:

1. `governing_law`: Clauses specifying which jurisdiction's laws apply
2. `termination`: Clauses about ending the agreement
3. `assignment`: Clauses about transferring rights or obligations
4. `confidentiality`: Clauses protecting sensitive information
5. `indemnification`: Clauses about compensating for losses
6. `limitation_of_liability`: Clauses limiting legal responsibility
7. `warranty`: Clauses providing guarantees
8. `arbitration`: Clauses specifying dispute resolution methods
9. `force_majeure`: Clauses about unforeseeable circumstances
10. `intellectual_property`: Clauses about IP rights
11. `non_compete`: Clauses restricting competition
12. `severability`: Clauses ensuring partial invalidity doesn't void entire agreement
13. `amendment`: Clauses about changing the agreement
14. `notice`: Clauses about communication requirements
15. `waiver`: Clauses about giving up certain rights
16. `entire_agreement`: Clauses declaring the document as the complete agreement
17. `representation`: Clauses containing factual statements
18. `payment_terms`: Clauses about financial obligations
19. `compliance_with_laws`: Clauses requiring adherence to regulations
20. `survival`: Clauses specifying what persists after termination

## Integration Components

The clause classification feature is integrated throughout the application:

### Backend

1. **Classifier Module**: Located at `backend/backend_core/models/clause_classifier/classifier.py`
   - Loads the RoBERTa model
   - Provides methods for single and batch classification
   - Maps model outputs to clause types
   - Implemented as a singleton for efficiency

2. **API Endpoints**: Located at `backend/backend_core/api/clause_classification.py`
   - `/api/classify-clause/`: For single clause classification
   - `/api/classify-clauses-batch/`: For batch classification

3. **Document Processing**: In `backend/backend_core/api/views.py`
   - Automatically classifies all annotations during document processing
   - Saves classification results with confidence scores to the database

4. **Database Model**: Enhanced `Annotation` model in `backend/backend_core/api/models.py`
   - Added `clause_type` field to store the classification
   - Added `clause_confidence` field to store the confidence score

### Frontend

1. **Document Viewer**: Enhanced to show clause types
   - Added clause type information to annotation tooltips
   - Visual indicator (dotted underline) for classified clauses
   
2. **Annotation Details Panel**: Shows detailed classification information
   - Displays clause type with confidence score
   - Progress bar visualization of confidence level
   
3. **API Types**: Updated in `src/lib/api.ts` to include clause classification fields

## Using the Classifier

### In Document Processing

The clause classifier runs automatically during document processing. When a document is uploaded and analyzed, each detected annotation is classified and the results are stored in the database.

### Through API Endpoints

You can directly use the classification API endpoints:

```javascript
// Example: Classify a single clause
const response = await fetch('/api/classify-clause/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: "This Agreement shall be governed by the laws of California." })
});
const result = await response.json();
console.log(result.classification.clause_type); // "governing_law"
```

### Testing

1. Run the included test script to verify the model works correctly:
   ```
   python test_classifier.py
   ```

2. Run the Django tests for API endpoints:
   ```
   cd backend/backend_core
   python manage.py test api.tests_clause_classifier
   ```

## Setup Instructions

1. Extract the model files to the correct directory:
   ```
   extract_model.bat path\to\model_zip_file.zip
   ```

2. The model files should be in the following directory:
   ```
   backend/backend_core/models/clause_classifier/
   ```

3. Run the migrations to add the database fields:
   ```
   cd backend/backend_core
   python manage.py migrate
   ```

## Performance Considerations

- The RoBERTa model requires significant memory, especially when loaded on CPU
- For better performance, a GPU is recommended but not required
- The model is loaded on first use and kept in memory as a singleton instance
- Batch classification is more efficient than multiple single classifications
