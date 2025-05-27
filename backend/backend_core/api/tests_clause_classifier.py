"""
Tests for the clause classification functionality.
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

class ClauseClassificationTests(TestCase):
    """Test the clause classification API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
    
    def test_classify_clause_endpoint(self):
        """Test the single clause classification endpoint"""
        url = reverse('classify_clause')
        data = {
            "text": "This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware."
        }
        
        # This test just verifies the endpoint works rather than testing the model prediction
        # which could change with different model versions
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('classification', response.data)
        self.assertIn('clause_type', response.data['classification'])
        self.assertIn('confidence', response.data['classification'])
    
    def test_classify_clauses_batch_endpoint(self):
        """Test the batch clause classification endpoint"""
        url = reverse('classify_clauses_batch')
        data = {
            "texts": [
                "This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware.",
                "Either party may terminate this Agreement upon thirty (30) days prior written notice.",
                "All information disclosed under this Agreement shall be considered confidential."
            ]
        }
        
        # This test just verifies the endpoint works rather than testing the model prediction
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 3)  # Should have 3 results
        
        # Check structure of first result
        first_result = response.data['results'][0]
        self.assertIn('text', first_result)
        self.assertIn('classification', first_result)
        self.assertIn('clause_type', first_result['classification'])
        self.assertIn('confidence', first_result['classification'])
    
    def test_classify_clause_no_text(self):
        """Test classification endpoint with missing text"""
        url = reverse('classify_clause')
        data = {}  # Empty data
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_classify_clauses_batch_no_texts(self):
        """Test batch classification endpoint with missing texts"""
        url = reverse('classify_clauses_batch')
        data = {}  # Empty data
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
