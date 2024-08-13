# bookrecord/models.py

from django.db import models
from django.contrib.auth.models import User

# Define the Genre model with choices
class Genre(models.Model):
    GENRE_CHOICES = [
        ('A', 'Genre A'),
        ('B', 'Genre B'),
        ('C', 'Genre C'),
    ]
    genre_id = models.AutoField(primary_key=True)
    genre_name = models.CharField(max_length=100, choices=GENRE_CHOICES, unique=True)

    def __str__(self):
        return self.get_genre_name_display()

class Tag(models.Model):
    tag_id = models.AutoField(primary_key=True)
    tag_name = models.CharField(max_length=100)

    def __str__(self):
        return self.tag_name

class BasicInfo(models.Model):
    basic_info_code = models.AutoField(primary_key=True)
    registrant = models.CharField(max_length=100)
    registration_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    purpose = models.TextField(null=True, blank=True)  # null=Trueを追加
    buy_reason = models.TextField(null=True, blank=True)  # null=Trueを追加
    is_finished = models.BooleanField(default=False)

    def __str__(self):
        return str(self.basic_info_code)

class Book(models.Model):
    book_code = models.AutoField(primary_key=True)
    registration_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=200)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)
    summary = models.TextField()
    author = models.CharField(max_length=255, null=True, blank=True)  # 著者フィールドを追加
    publisher = models.CharField(max_length=255, null=True, blank=True)  # 出版者フィールドを追加
    registrant = models.CharField(max_length=100)
    delete_flag = models.BooleanField(default=False)
    cover_image = models.ImageField(upload_to='book_covers/', null=True, blank=True)
    basic_info_code = models.ForeignKey(BasicInfo, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.title

class BookUser(models.Model):
    book_code = models.ForeignKey(Book, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    basic_info_code = models.ForeignKey(BasicInfo, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.book_code} - {self.user_id}"

class BasicInfoTag(models.Model):
    basic_info_code = models.ForeignKey(BasicInfo, on_delete=models.CASCADE)
    tag_id = models.ForeignKey(Tag, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.basic_info_code} - {self.tag_id}"

class ReadingNote(models.Model):
    basic_info_code = models.ForeignKey(BasicInfo, on_delete=models.CASCADE)
    note_id = models.AutoField(primary_key=True)
    registration_date = models.DateField()    
    update_date = models.DateTimeField(auto_now=True)
    impression = models.TextField()
    learning = models.TextField()

    def __str__(self):
        return f"{self.basic_info_code} - {self.note_id}"

class PostReadingSummary(models.Model):
    basic_info_code = models.ForeignKey(BasicInfo, on_delete=models.CASCADE)
    summary_id = models.AutoField(primary_key=True)
    registration_date = models.DateField()
    update_date = models.DateTimeField(auto_now=True)
    impression = models.TextField()
    learning = models.TextField()
    satisfaction_level = models.IntegerField()
    note = models.TextField()

    def __str__(self):
        return f"{self.basic_info_code} - {self.summary_id}"

class InterestedBook(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"