from django.db import models
from users.models import User

# Models are used to define the structure of your database tables.
# Create your models here.

class TodoItem(models.Model):
  STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('in_progress', 'In Progress'),
    ('done', 'done'),
  ]

  title = models.CharField(max_length=100)
  description = models.TextField()
  status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
  created_at = models.DateTimeField(auto_now_add=True)  
  last_modified = models.DateTimeField(auto_now=True)
  assignee = models.ForeignKey(User, on_delete=models.CASCADE)

class TodoList(models.Model):
  owner = models.ForeignKey(User, on_delete=models.CASCADE)  # Foreign key to the User model
  items = models.ManyToManyField(TodoItem)
  created_at = models.DateTimeField(auto_now_add=True)
  last_modified = models.DateTimeField(auto_now=True)
