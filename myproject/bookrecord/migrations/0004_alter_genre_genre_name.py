# Generated by Django 4.2.13 on 2024-06-07 21:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookrecord', '0003_remove_book_genre_book_genres_alter_genre_genre_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='genre',
            name='genre_name',
            field=models.CharField(choices=[('A', 'Genre A'), ('B', 'Genre B'), ('C', 'Genre C')], max_length=100, unique=True),
        ),
    ]
