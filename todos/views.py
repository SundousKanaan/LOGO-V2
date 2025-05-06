from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import TodoItem, TodoList
from .serializers import TodoItemSerializer, TodoListSerializer
from .permissions import IsAdminOrOwner

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.models import User

# Create your views here.

# API endpoint to get TodoItems for a user
# This endpoint is accessible only to authenticated users.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userTodoItems(request, user_id):
    req_user = request.user

    if not req_user.is_staff and req_user.id != user_id:
        return Response({"Error": "You do not have permission to view this TodoList"}, status=403)
    
    try:
        user = User.objects.get(id=user_id) # Get the user object from the database
    except User.DoesNotExist:
        return Response({"Error": "User not found"}, status=404)
    
    tasks = TodoItem.objects.filter(assignee=user) # Get the TodoItem objects assigned to the user
    serializer = TodoItemSerializer(tasks, many=True) # Serialize the TodoItem objects
    return Response({"tasks": serializer.data}) # Return the serialized data as a response


# API endpoint to get TodoLists for a user
# This endpoint is accessible only to authenticated users.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userTodoLists(request, user_id):
    req_user = request.user

    if not req_user.is_staff and req_user.id != user_id:
        return Response({"Error": "You do not have permission to view this TodoList"}, status=403)
    
    try:
        user = User.objects.get(id=user_id) # Get the user object from the database
    except User.DoesNotExist:
        return Response({"Error": "User not found"}, status=404)
    
    lists = TodoList.objects.filter(owner=user)
    serializer = TodoListSerializer(lists, many=True) 
    return Response({"lists": serializer.data})

# TodoItemViewSet is a viewset for the TodoItem model.
# It provides CRUD operations for TodoItem objects.
class TodoItemViewSet(viewsets.ModelViewSet):
    serializer_class = TodoItemSerializer # Define the serializer class for the viewset
    permission_classes = [IsAuthenticated, IsAdminOrOwner] # Define the permission classes for the viewset

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return TodoItem.objects.all()
        return TodoItem.objects.filter(assignee=user)

    def perform_create(self, serializer):
        req_user = self.request.user # Get the user from the request
        todo_item = serializer.validated_data # Get the validated data from the serializer

        todo_list = self.request.data.get('todolist_id') # Get the TodoList ID from the request data
        print('TodoList ID:', todo_list)
        if not todolist_id: # Check if the TodoList ID is provided
            raise serializers.ValidationError("TodoList_id is required")

        try:
            todolist = TodoList.objects.get(id=todolist_id) # Get the TodoList object from the database
        except TodoList.DoesNotExist:
            raise serializers.ValidationError("TodoList not found")

        if not (req_user.is_staff or todolist.owner == req_user):
            raise serializers.ValidationError("You do not have permission to add items to this TodoList")

        todo_item_obj = serializer.save() # Save the TodoItem object to the database
        todolist.items.add(todo_item_obj) # Add the TodoItem to the TodoList


# TodoListViewSet is a viewset for the TodoList model.
# It provides CRUD operations for TodoList objects.
class TodoListViewSet(viewsets.ModelViewSet):
    serializer_class = TodoListSerializer 
    permission_classes = [IsAuthenticated, IsAdminOrOwner] 

    # Define the queryset for the viewset
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return TodoList.objects.all()
        return TodoList.objects.filter(owner=user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


