import unittest
from api.app import app

question_id = '1-1'
topic_id = '1-1-1'

class TopicsTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_topics(self):
        response = self.app.get(f'/api/topics/{question_id}')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)

    def test_common_topics(self):
        response = self.app.get(f'/api/topics/common/{question_id}?limit=5')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)
        self.assertLessEqual(len(data), 5)

    def test_top_words(self):
        response = self.app.get(f'/api/topics/topwords/{topic_id}?limit=10')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)
        self.assertLessEqual(len(data), 10)

    def test_search_responses(self):
        response = self.app.get(f'/api/topics/search/{question_id}/{topic_id}?offset=0&limit=20')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)
        self.assertLessEqual(len(data), 20)

    def test_num_responses(self):
        response = self.app.get(f'/api/topics/numresponses/{topic_id}')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('topic_count', data)
        self.assertIsInstance(data['topic_count'], int)

    def test_average_sentiment(self):
        response = self.app.get(f'/api/topics/sentiment/{topic_id}')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('positive', data)
        self.assertIn('negative', data)
        self.assertIsInstance(data['positive'], (float, int))
        self.assertIsInstance(data['negative'], (float, int))

if __name__ == '__main__':
    unittest.main()