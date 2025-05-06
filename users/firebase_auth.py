import firebase_admin
from users.models import User
from firebase_admin import credentials, exceptions, auth
from rest_framework import authentication

from .exceptions import *

from django.conf import settings
import os

# Initialize Firebase Admin SDK with service account credentials
cert_path = os.path.join(settings.BASE_DIR, 'serviceAccountKey.json')
cred = credentials.Certificate(cert_path)
if not firebase_admin._apps:
    default_app = firebase_admin.initialize_app(cred)

# This middleware is used to authenticate users based on Firebase ID tokens.
# It checks the Authorization header in the request and verifies the token using Firebase Admin SDK.
class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION")
        if not auth_header:
            raise NoAuthToken("No auth token provided")

        id_token = auth_header.split(" ").pop()
        return handle_auth(id_token,throw_error=True)

# This middleware allows for optional authentication, meaning that if the token is not provided or invalid, it won't raise an error.
class FirebaseOptionalAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        
        auth_header = request.META.get("HTTP_AUTHORIZATION")
        if not auth_header:
            return None

        id_token = auth_header.split(" ").pop()
        return handle_auth(id_token)

def authenticate_token(id_token):
    return handle_auth(id_token)

# This middleware allows for optional authentication, meaning that if the token is not provided or invalid, it won't raise an error.
def handle_auth(id_token,throw_error=False):
    decoded_token = None
    try:
        decoded_token = auth.verify_id_token(id_token)        
    except Exception as err:
        if throw_error:
            print(err)
            raise InvalidAuthToken("Invalid auth token")
        else: return None

    if not id_token or not decoded_token:
        return None

    try:
        uid = decoded_token.get("uid")
    except Exception as err:
        if throw_error: raise FirebaseError()
        else: return None

    # Check if the user exists in the database, if not, create a new user
    user, created = User.objects.get_or_create(firebase_uid=uid)
    return (user, None)