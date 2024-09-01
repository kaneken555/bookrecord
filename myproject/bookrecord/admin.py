from django.contrib import admin
from .models import Genre

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ('genre_name', 'genre_id')  # 表示したいフィールドを指定
    search_fields = ('genre_name',)  # 検索ボックスを追加