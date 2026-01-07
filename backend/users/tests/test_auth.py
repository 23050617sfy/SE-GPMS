from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token


class AuthAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # create a student user
        self.student = User.objects.create_user(username='s123', email='s123@example.com', password='pass123')
        self.student.profile.role = 'student'
        self.student.profile.save()

        # create a teacher user
        self.teacher = User.objects.create_user(username='t456', email='t456@example.com', password='pass456')
        self.teacher.profile.role = 'teacher'
        self.teacher.profile.save()

        # create an admin user
        self.admin = User.objects.create_user(username='admin1', email='admin1@example.com', password='adminpass')
        self.admin.profile.role = 'admin'
        self.admin.profile.save()

    def test_login_success_by_username(self):
        resp = self.client.post('/api/auth/login/', {'identifier': 's123', 'password': 'pass123'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('token', resp.data)
        self.assertIn('user', resp.data)
        self.assertEqual(resp.data['user']['role'], 'student')
        # token exists in DB
        token_key = resp.data['token']
        self.assertTrue(Token.objects.filter(key=token_key).exists())

    def test_login_success_by_email(self):
        resp = self.client.post('/api/auth/login/', {'identifier': 't456@example.com', 'password': 'pass456'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['user']['role'], 'teacher')

    def test_login_wrong_password(self):
        resp = self.client.post('/api/auth/login/', {'identifier': 's123', 'password': 'wrong'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', resp.data)

    def test_login_missing_fields(self):
        resp = self.client.post('/api/auth/login/', {'identifier': ''}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        # serializer should report password field error
        self.assertTrue('password' in resp.data or 'non_field_errors' in resp.data)

    def test_role_in_user_serializer(self):
        # ensure the user serializer includes role
        resp = self.client.post('/api/auth/login/', {'identifier': 'admin1', 'password': 'adminpass'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['user']['role'], 'admin')

    # Additional tests using equivalence class partitioning for login inputs
    def test_login_nonexistent_user(self):
        # identifier does not match any username or email
        resp = self.client.post('/api/auth/login/', {'identifier': 'no_such_user', 'password': 'whatever'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', resp.data)

    def test_login_empty_identifier_and_password(self):
        # both fields empty => serializer validation error
        resp = self.client.post('/api/auth/login/', {'identifier': '', 'password': ''}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        # expect serializer to report missing/blank fields
        self.assertTrue('identifier' in resp.data or 'password' in resp.data or 'non_field_errors' in resp.data)

    def test_login_empty_password(self):
        # identifier exists but password empty -> validation error
        resp = self.client.post('/api/auth/login/', {'identifier': 's123', 'password': ''}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue('password' in resp.data or 'non_field_errors' in resp.data)

    def test_login_with_special_char_identifier(self):
        # special characters that don't match any user
        resp = self.client.post('/api/auth/login/', {'identifier': '!!!@@@', 'password': 'x'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', resp.data)

    def test_token_reuse_on_repeated_login(self):
        # first login creates a token
        resp1 = self.client.post('/api/auth/login/', {'identifier': 's123', 'password': 'pass123'}, format='json')
        self.assertEqual(resp1.status_code, status.HTTP_200_OK)
        token1 = resp1.data.get('token')
        self.assertTrue(Token.objects.filter(key=token1).exists())

        # second login should return the same token (get_or_create)
        resp2 = self.client.post('/api/auth/login/', {'identifier': 's123', 'password': 'pass123'}, format='json')
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        token2 = resp2.data.get('token')
        self.assertEqual(token1, token2)
