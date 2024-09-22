# bookrecord/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.top_view, name='top'),
    path('new/', views.new, name='new'),
    path('detail/<int:book_id>/', views.detail_view, name='detail'),
    path('readingnote/<int:book_id>/', views.readingnote_view, name='readingnote'),
    path('postreading/<int:book_id>/', views.postreading_view, name='postreading'),
    path('update_basic_info/<int:basic_info_id>/', views.update_basic_info, name='update_basic_info'),
    path('update_reading_note/<int:note_id>/', views.update_reading_note, name='update_reading_note'),
    path('update_post_reading_summary/<int:summary_id>/', views.update_post_reading_summary, name='update_post_reading_summary'),
    path('delete_basic_info/<int:basic_info_id>/', views.delete_basic_info, name='delete_basic_info'),
    path('delete_reading_note/<int:note_id>/', views.delete_reading_note, name='delete_reading_note'),
    path('delete_post_reading_summary/<int:summary_id>/', views.delete_post_reading_summary, name='delete_post_reading_summary'),
    path('list/', views.list_view, name='list'),
    path('search/', views.search_view, name='search'),
    path('register_book/<int:book_id>/', views.register_book, name='register_book'),
    path('add_to_interested/<int:book_id>/', views.add_to_interested, name='add_to_interested'),
    path('interested_list/', views.interested_list_view, name='interested_list'),
    path('search_books/', views.search_books, name='search_books'),
    path('get_basic_info/<int:basic_info_id>/', views.get_basic_info, name='get_basic_info'),


]
