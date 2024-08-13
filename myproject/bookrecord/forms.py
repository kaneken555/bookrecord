# bookrecord/forms.py

from django import forms
from .models import Book, Tag, Genre, BasicInfo, ReadingNote, PostReadingSummary
from datetime import date


class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['title', 'genre', 'cover_image', 'summary', 'author', 'publisher']
        labels = {
            'title': 'タイトル',
            'genre': 'ジャンル',
            'cover_image': 'カバー画像',
            'summary': '概要',
            'author': '著者',
            'publisher': '出版社'
        }

class BasicInfoForm(forms.ModelForm):
    class Meta:
        model = BasicInfo
        fields = ['purpose', 'buy_reason']
        labels = {
            'purpose': '目的',
            'buy_reason': '購入のきっかけ',
        }
        widgets = {
            'purpose': forms.Textarea(attrs={'rows': 2}),  # 高さを4行に設定
            'buy_reason': forms.Textarea(attrs={'rows': 2}),  # 高さを2行に設定
        }

class ReadingNoteForm(forms.ModelForm):
    registration_date = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date'}),
        initial=date.today,  # 初期値を設定
        required=True,
        label='日付'
    )

    class Meta:
        model = ReadingNote
        fields = ['registration_date', 'impression', 'learning']
        labels = {
            'registration_date': '日付',
            'impression': '気づき',
            'learning': '学び',
        }

class PostReadingSummaryForm(forms.ModelForm):
    registration_date = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date'}),
        initial=date.today,  # 初期値を設定
        required=True,
        label='日付'
    )
    satisfaction_level = forms.ChoiceField(
        choices=[(i, i) for i in range(1, 6)],
        required=True,
        label='満足度'
    )

    class Meta:
        model = PostReadingSummary
        fields = ['registration_date', 'impression', 'learning', 'satisfaction_level']
        labels = {
            'registration_date': '日付',
            'impression': '感想',
            'learning': '学び',
            'satisfaction_level': '満足度',
        }

