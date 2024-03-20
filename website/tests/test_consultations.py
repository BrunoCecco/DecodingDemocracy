import unittest
from api.app import app

consultation_id = 1

class ConsultationsTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_get_all_consultations(self):
        response = self.app.get('/api/consultations/')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)

    def test_get_specific_consultation(self):        
        response = self.app.get(f'/api/consultations/{consultation_id}')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, dict)
        self.assertEqual(data['id'], consultation_id)

if __name__ == '__main__':
    unittest.main()