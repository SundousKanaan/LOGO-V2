from .models import User, TodoList, TodoItem
from .serializers import TodoListSerializer, TodoItemSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(['GET']) # This decorator is used to specify that this view will handle GET requests
def TodoListApi(request): # This is a viewset for the TodoList model, which provides CRUD operations
    queryset = TodoList.objects.all() # This will fetch all TodoList objects from the database
    data = TodoListSerializer(queryset, many=True).data
    return Response({'data': data}) # This will return the serialized data as a JSON response

@api_view(['GET'])
def TodoItemApi(request):
    queryset = TodoItem.objects.all()
    data = TodoItemSerializer(queryset, many=True).data
    return Response({'data': data}) 
    