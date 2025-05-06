from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):  
  class Meta: # metadata about the serializer
    model = User  # Specify the model to serialize
    fields = '__all__'  # This will include all fields in the model