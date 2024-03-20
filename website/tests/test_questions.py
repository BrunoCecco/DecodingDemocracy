import unittest
from api.app import app

consultation_id = 1
question_id = '1-1'

class QuestionsTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_get_questions_for_consultation(self):        
        response = self.app.get(f'/api/questions/{consultation_id}')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)

    def test_get_specific_question(self):        
        response = self.app.get(f'/api/questions/{question_id}')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, dict)
        self.assertEqual(data['id'], question_id)

    def test_get_wordcloud_for_question(self):
        response = self.app.get(f'/api/questions/wordcloud/{question_id}')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, dict)
        self.assertIn('wordcloud', data)

if __name__ == '__main__':
    unittest.main()