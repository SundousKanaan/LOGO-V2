from django.urls import path
from . import  views
from . import api
from rest_framework.routers import DefaultRouter

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'todolists', views.TodoListViewSet, basename='todolist')
router.register(r'todoitems', views.TodoItemViewSet, basename='todoitem')

urlpatterns = [
    path('api/<int:user_id>/todoItems/' , views.userTodoItems, name='userTodoItems'),
    path('api/<int:user_id>/todoLists/' , views.userTodoLists, name='userTodoLists'),
    path('api/todolists/', api.TodoListApi, name='todoListApi'),
    path('api/todoitems/', api.TodoItemApi, name='todoItemApi'), 
]

urlpatterns += router.urls  # Add the router URLs to urlpatterns
