from django.contrib import admin
from .models import Book, Genre, BasicInfo, Tag, BookUser, ReadingNote, PostReadingSummary, InterestedBook, BasicInfoTag


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'publisher', 'basic_info_code', 'genre')  # 管理画面で表示するフィールド
    search_fields = ('title', 'author', 'publisher')  # 検索フィールド
    list_filter = ('genre',)  # フィルタリングオプション

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ('genre_name', 'genre_id')  # 表示したいフィールドを指定
    search_fields = ('genre_name',)  # 検索ボックスを追加

@admin.register(BasicInfo)
class BasicInfoAdmin(admin.ModelAdmin):
    list_display = ('basic_info_code', 'registrant', 'registration_date', 'purpose', 'is_finished')
    search_fields = ('registrant', 'purpose')

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('tag_name',)

@admin.register(BasicInfoTag)
class BasicInfoTagAdmin(admin.ModelAdmin):
    list_display = ('basic_info_code', 'tag_id')

@admin.register(BookUser)
class BookUserAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'book_code', 'basic_info_code')

@admin.register(ReadingNote)
class ReadingNoteAdmin(admin.ModelAdmin):
    list_display = ('basic_info_code', 'impression', 'learning', 'registration_date')
    search_fields = ('impression', 'learning')

@admin.register(PostReadingSummary)
class PostReadingSummaryAdmin(admin.ModelAdmin):
    list_display = ('basic_info_code', 'impression', 'learning', 'satisfaction_level', 'registration_date')
    search_fields = ('impression', 'learning')

@admin.register(InterestedBook)
class InterestedBookAdmin(admin.ModelAdmin):
    list_display = ('user', 'book')