from django.db import models

# Create your models here.
class User(models.Model):
  USER_TYPES =[ # Tuple of user types
    ('admin', 'Admin'),
    ('user', 'User'),
  ]

  firebase_uid = models.CharField(max_length=255, unique=True, default='')  # Unique identifier for the user in Firebase
  email = models.CharField(max_length=100)
  phone = models.CharField(max_length=15)
  first_name = models.CharField(max_length=50)
  last_name = models.CharField(max_length=50)
  birthday = models.DateField()
  is_active = models.BooleanField(default=True)
  user_type = models.CharField(max_length=50, choices=USER_TYPES, default='user') # User type with choices
  created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when the record was created
  last_modified = models.DateTimeField(auto_now=True)  # Timestamp when the record was last modified

  def __str__(self): # String representation of the model
    return f"{self.first_name} {self.last_name}({self.email})" # This will return the user's full name and email when the object is printed or logged
