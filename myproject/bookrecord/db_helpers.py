# bookrecord/db_helpers.py

import os
from urllib.request import urlopen
from django.core.files.base import ContentFile
from django.db.models import Q
from .models import BookUser, ReadingNote, PostReadingSummary, BasicInfo, Book, Genre, Tag, BasicInfoTag, InterestedBook


def get_genres():
    return {genre.genre_id: genre.genre_name for genre in Genre.objects.all()}

# def get_books_by_genre(user, selected_genre):
#     if selected_genre == 'all':
#         user_book_users = BookUser.objects.filter(user_id=user)
#         other_book_users = BookUser.objects.exclude(user_id=user)
#     else:
#         user_book_users = BookUser.objects.filter(user_id=user, book_code__genre__genre_id=selected_genre)
#         other_book_users = BookUser.objects.filter(book_code__genre__genre_id=selected_genre).exclude(user_id=user)
    
#     unfinished_books = [book_user.book_code for book_user in user_book_users if not book_user.basic_info_code.is_finished]
#     other_books = [book_user.book_code for book_user in other_book_users]

#     return unfinished_books, other_books


def get_unfinished_books_by_genre(user, selected_genre):
    if selected_genre == 'all':
        user_book_users = BookUser.objects.filter(user_id=user)
    else:
        user_book_users = BookUser.objects.filter(user_id=user, book_code__genre__genre_id=selected_genre)
    
    unfinished_books = [book_user.book_code for book_user in user_book_users if not book_user.basic_info_code.is_finished]

    return unfinished_books

def get_finished_books_by_genre(user, selected_genre):
    if selected_genre == 'all':
        user_book_users = BookUser.objects.filter(user_id=user)
    else:
        user_book_users = BookUser.objects.filter(user_id=user, book_code__genre__genre_id=selected_genre)
    
    unfinished_books = [book_user.book_code for book_user in user_book_users if book_user.basic_info_code.is_finished]

    return unfinished_books

def get_other_books_by_genre(user, selected_genre):
    if selected_genre == 'all':
        other_book_users = BookUser.objects.exclude(user_id=user)
    else:
        other_book_users = BookUser.objects.filter(book_code__genre__genre_id=selected_genre).exclude(user_id=user)
    
    other_books = [book_user.book_code for book_user in other_book_users]

    return other_books
