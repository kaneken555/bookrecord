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

def get_books_by_genre(user, selected_genre):
    if selected_genre == 'all':
        user_book_users = BookUser.objects.filter(user_id=user)
    else:
        user_book_users = BookUser.objects.filter(user_id=user, book_code__genre__genre_id=selected_genre)
    
    all_books = [book_user.book_code for book_user in user_book_users]

    return all_books

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
    
    finished_books = [book_user.book_code for book_user in user_book_users if book_user.basic_info_code.is_finished]

    return finished_books

def get_other_books_by_genre(user, selected_genre):
    if selected_genre == 'all':
        other_book_users = BookUser.objects.exclude(user_id=user)
    else:
        other_book_users = BookUser.objects.filter(book_code__genre__genre_id=selected_genre).exclude(user_id=user)
    
    other_books = [book_user.book_code for book_user in other_book_users]

    return other_books

def search_books_in_app(query):
    return Book.objects.filter(
        Q(title__icontains=query) |
        Q(basic_info_code__purpose__icontains=query) |
        Q(basic_info_code__buy_reason__icontains=query)
    )

def create_book_user(user, book, basic_info):
    return BookUser.objects.create(
        user_id=user,
        book_code=book,
        basic_info_code=basic_info
    )

def create_basic_info(registrant, is_finished=False):
    return BasicInfo.objects.create(
        registrant=registrant,
        is_finished=is_finished
    )

def add_tags_to_basic_info(basic_info, tag_names):
    for tag_name in tag_names:
        if tag_name:
            tag, created = Tag.objects.get_or_create(tag_name=tag_name)
            BasicInfoTag.objects.create(basic_info_code=basic_info, tag_id=tag)
