import unittest
from api.app import app

question_id = '1-1'
topic_id = '1-1-1'
responder_id = 1

class ResponsesTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_get_responses_for_responder(self):        
        response = self.app.get(f'/api/responses/{responder_id}')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)

    def test_get_responses_for_question(self):        
        response = self.app.get(f'/api/responses/{question_id}?offset=0&limit=10')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)
        self.assertLessEqual(len(data), 10)

    def test_search_responses(self):
        search_term = 'example'
        response = self.app.get(f'/api/responses/search/{question_id}/{search_term}?offset=0&limit=10')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)
        self.assertLessEqual(len(data), 10)

    def test_sentiment_distribution(self):
        response = self.app.get(f'/api/responses/sentiment/{question_id}')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('positive', data)
        self.assertIn('negative', data)

    def test_multiple_choice(self):
        response = self.app.get(f'/api/responses/multiplechoice/{question_id}')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)

    def test_similar_responses(self):        
        text = 'example text'
        response = self.app.get(f'/api/responses/similar/{question_id}/{text}?offset=0&limit=10')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)
        self.assertLessEqual(len(data), 10)

if __name__ == '__main__':
    unittest.main()