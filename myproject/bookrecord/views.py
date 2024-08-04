# bookrecord/views.py

import os
import requests

from django.shortcuts import render, redirect, get_object_or_404
from .forms import BookForm, BasicInfoForm, ReadingNoteForm, PostReadingSummaryForm
from .models import BookUser, ReadingNote, PostReadingSummary, BasicInfo, Book, Genre, Tag, BasicInfoTag, InterestedBook
from django.db.models import Q  # 追加

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_GET

@login_required
def top_view(request):
    genres = {genre.genre_id: genre.genre_name for genre in Genre.objects.all()}
    selected_genre = request.GET.get('genre', 'all')

    if selected_genre == 'all':
        user_book_users = BookUser.objects.filter(user_id=request.user)
        other_book_users = BookUser.objects.exclude(user_id=request.user)
    else:
        user_book_users = BookUser.objects.filter(user_id=request.user, book_code__genre__genre_id=selected_genre)
        other_book_users = BookUser.objects.filter(book_code__genre__genre_id=selected_genre).exclude(user_id=request.user)

    # 未完了の本を取得
    unfinished_books = [book_user.book_code for book_user in user_book_users if not book_user.basic_info_code.is_finished]
    other_books = [book_user.book_code for book_user in other_book_users]

    return render(request, 'top.html', {
        'unfinished_books': unfinished_books,
        'other_books': other_books,
        'genres': genres,
        'selected_genre': selected_genre
    })



@login_required
def new(request):
    if request.method == 'POST':
        book_form = BookForm(request.POST, request.FILES)
        basic_info_form = BasicInfoForm(request.POST)
        tag_names = request.POST.getlist('tags')
        
        print("Book Form Valid:", book_form.is_valid())
        print("Basic Info Form Valid:", basic_info_form.is_valid())
        print("Tag Names:", tag_names)
        
        if book_form.is_valid() and basic_info_form.is_valid():
            book = book_form.save(commit=False)
            basic_info = basic_info_form.save(commit=False)
            basic_info.registrant = request.user.username
            basic_info.save()
            book.basic_info_code = basic_info
            book.save()

            # BookUserに新しいレコードを追加
            new_book_user = BookUser.objects.create(
                book_code=book,
                user_id=request.user,
                basic_info_code=basic_info
            )
            print(f"BookUser created: {new_book_user}")

            for tag_name in tag_names:
                if tag_name:
                    tag, created = Tag.objects.get_or_create(tag_name=tag_name)
                    BasicInfoTag.objects.create(basic_info_code=basic_info, tag_id=tag)

            return redirect('top')
        else:
            print("Book Form Errors:", book_form.errors)
            print("Basic Info Form Errors:", basic_info_form.errors)
    else:
        book_form = BookForm()
        basic_info_form = BasicInfoForm()

    return render(request, 'new.html', {
        'book_form': book_form,
        'basic_info_form': basic_info_form,
    })
    
@login_required
def detail_view(request, book_id):
    book = get_object_or_404(Book, book_code=book_id)
    user = request.user
    try:
        book_user = BookUser.objects.get(book_code=book, user_id=user)
        basic_info = book_user.basic_info_code
    except BookUser.DoesNotExist:
        basic_info = book.basic_info_code  # 他のユーザーの basic_info を使用

    reading_notes = ReadingNote.objects.filter(basic_info_code=book.basic_info_code)
    post_reading_summaries = PostReadingSummary.objects.filter(basic_info_code=book.basic_info_code)

    return render(request, 'detail.html', {
        'book': book,
        'basic_info': basic_info,
        'reading_notes': reading_notes,
        'post_reading_summaries': post_reading_summaries,
        'user': user
    })



@login_required
def list_view(request):
    genres = {genre.genre_id: genre.genre_name for genre in Genre.objects.all()}
    selected_genre = request.GET.get('genre', 'all')
    
    if selected_genre == 'all':
        user_book_users = BookUser.objects.filter(user_id=request.user)
    else:
        user_book_users = BookUser.objects.filter(user_id=request.user, book_code__genre__genre_id=selected_genre)

    # FinishedとUnfinishedの本を分けてリスト化
    finished_books = [book_user.book_code for book_user in user_book_users if book_user.basic_info_code.is_finished]
    unfinished_books = [book_user.book_code for book_user in user_book_users if not book_user.basic_info_code.is_finished]

    return render(request, 'list.html', {
        'finished_books': finished_books,
        'unfinished_books': unfinished_books,
        'genres': genres,
        'selected_genre': selected_genre
    })

@login_required
def readingnote_view(request, book_id):
    book_user = get_object_or_404(BookUser, book_code=book_id, user_id=request.user)
    if request.method == "POST":
        form = ReadingNoteForm(request.POST)
        if form.is_valid():
            reading_note = form.save(commit=False)
            reading_note.basic_info_code = book_user.book_code.basic_info_code
            reading_note.save()
            return redirect('detail', book_id=book_id)
    else:
        form = ReadingNoteForm()
    return render(request, 'readingnote.html', {'form': form, 'book': book_user.book_code})

@login_required
def postreading_view(request, book_id):
    book_user = get_object_or_404(BookUser, book_code=book_id, user_id=request.user)
    if request.method == "POST":
        form = PostReadingSummaryForm(request.POST)
        if form.is_valid():
            post_reading_summary = form.save(commit=False)
            post_reading_summary.basic_info_code = book_user.book_code.basic_info_code
            post_reading_summary.save()

            # Update BasicInfo's is_finished flag
            basic_info = post_reading_summary.basic_info_code
            basic_info.is_finished = True
            basic_info.save()
            return redirect('detail', book_id=book_id)
    else:
        form = PostReadingSummaryForm()
    return render(request, 'postreading.html', {'form': form, 'book': book_user.book_code})

@login_required
def update_basic_info(request, basic_info_id):
    basic_info = get_object_or_404(BasicInfo, pk=basic_info_id, registrant=request.user.username)
    book = get_object_or_404(Book, basic_info_code=basic_info)

    if request.method == 'POST':
        basic_info_form = BasicInfoForm(request.POST, instance=basic_info)
        book_form = BookForm(request.POST, request.FILES, instance=book)
        if basic_info_form.is_valid() and book_form.is_valid():
            basic_info_form.save()
            book_form.save()
            return redirect('detail', book_id=book.book_code)
    else:
        basic_info_form = BasicInfoForm(instance=basic_info)
        book_form = BookForm(instance=book)

    return render(request, 'update_basic_info.html', {
        'basic_info_form': basic_info_form,
        'book_form': book_form
    })

@login_required
def update_reading_note(request, note_id):
    reading_note = get_object_or_404(ReadingNote, pk=note_id)
    if request.method == "POST":
        form = ReadingNoteForm(request.POST, instance=reading_note)
        if form.is_valid():
            form.save()
            return redirect('detail', book_id=reading_note.basic_info_code.book_set.first().book_code)
    else:
        form = ReadingNoteForm(instance=reading_note)
    return render(request, 'update_reading_note.html', {'form': form})

@login_required
def update_post_reading_summary(request, summary_id):
    post_reading_summary = get_object_or_404(PostReadingSummary, pk=summary_id)
    if request.method == "POST":
        form = PostReadingSummaryForm(request.POST, instance=post_reading_summary)
        if form.is_valid():
            form.save()
            return redirect('detail', book_id=post_reading_summary.basic_info_code.book_set.first().book_code)
    else:
        form = PostReadingSummaryForm(instance=post_reading_summary)
    return render(request, 'update_post_reading_summary.html', {'form': form})

@login_required
def delete_basic_info(request, basic_info_id):
    basic_info = get_object_or_404(BasicInfo, pk=basic_info_id, registrant=request.user.username)
    if request.method == 'POST':
        basic_info.delete()
        return redirect('list')
    return render(request, 'confirm_delete.html', {'object': basic_info, 'type': 'Basic Info and all related Reading Notes and Post Reading Summaries'})

@login_required
def delete_reading_note(request, note_id):
    reading_note = get_object_or_404(ReadingNote, pk=note_id, basic_info_code__registrant=request.user.username)
    if request.method == 'POST':
        reading_note.delete()
        return redirect('detail', book_id=reading_note.basic_info_code.book_set.first().book_code)
    return render(request, 'confirm_delete.html', {'object': reading_note, 'type': 'Reading Note'})

@login_required
def delete_post_reading_summary(request, summary_id):
    post_reading_summary = get_object_or_404(PostReadingSummary, pk=summary_id, basic_info_code__registrant=request.user.username)
    if request.method == 'POST':
        post_reading_summary.delete()
        return redirect('detail', book_id=post_reading_summary.basic_info_code.book_set.first().book_code)
    return render(request, 'confirm_delete.html', {'object': post_reading_summary, 'type': 'Post Reading Summary'})

@login_required
def search_view(request):
    query = request.GET.get('q')
    books = BasicInfo.objects.none()  # 初期値は空のクエリセット
    if query:
        books = Book.objects.filter(
            Q(title__icontains=query) |
            Q(basic_info_code__purpose__icontains=query) |
            Q(basic_info_code__buy_reason__icontains=query)
        )
    user_books = BookUser.objects.filter(user_id=request.user).values_list('book_code', flat=True)

    return render(request, 'search_results.html', {'books': books, 'query': query, 'user_books': user_books})

@login_required
def register_book(request, book_id):
    book = get_object_or_404(Book, pk=book_id)
    user = request.user

    # BasicInfoのコピーを作成
    new_basic_info = BasicInfo.objects.create(
        registrant=user.username,
        is_finished=book.basic_info_code.is_finished
    )

    # BookUserに新しいレコードを追加
    if not BookUser.objects.filter(book_code=book, user_id=user).exists():
        new_book_user = BookUser.objects.create(
            book_code=book,
            user_id=user,
            basic_info_code=new_basic_info  # 新しいBasicInfoのインスタンスを使用
        )
        print(f"BookUser created: {new_book_user}")

    return redirect('top')


@login_required
def add_to_interested(request, book_id):
    book = get_object_or_404(Book, book_code=book_id)
    interested_book, created = InterestedBook.objects.get_or_create(user=request.user, book=book)
    return redirect('top')

@login_required
def interested_list_view(request):
    interested_books = InterestedBook.objects.filter(user=request.user)
    user_books = BookUser.objects.filter(user_id=request.user).values_list('book_code', flat=True)
    
    return render(request, 'interested_list.html', {
        'interested_books': interested_books,
        'user_books': user_books,
    })

@require_GET
def search_books(request):
    title = request.GET.get('title', '')
    if not title:
        return JsonResponse({'error': 'Title parameter is required.'}, status=400)

    api_key = os.environ.get('GOOGLE_BOOKS_API_KEY')  # 環境変数からAPIキーを取得

    url = f'https://www.googleapis.com/books/v1/volumes?q=intitle:{title}&key={api_key}'

    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return JsonResponse(data)
    else:
        return JsonResponse({'error': 'Failed to fetch data from Google Books API.'}, status=response.status_code)